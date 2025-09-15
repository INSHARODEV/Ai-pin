import { Injectable, InternalServerErrorException } from "@nestjs/common";
 
import * as fs from "fs";
import * as crypto from "crypto";

@Injectable()
export class BackblazeCloudService {
  private keyId = process.env.BACKBLAZE_API_KEY_ID;
  private appKey = process.env.BACKBLAZE_APP_KEY;
  private bucketId = process.env.BACKBLAZE_BUCKET_ID;
  private bucketName = process.env.BACKBLAZE_BUCKET_NAME;

  private apiUrl: string;
  private downloadUrl: string;
  private authToken: string;
  private authTokenExpiry: number; // Timestamp in ms
  private uploadUrl: string;
  private uploadAuthToken: string;
  private uploadTokenExpiry: number; // Timestamp in ms

  /** Step 1 — Authorize Account */
  private async authorize(): Promise<void> {
    if (!this.keyId || !this.appKey) {
      throw new Error("❌ BACKBLAZE_API_KEY_ID or BACKBLAZE_APP_KEY is missing in .env");
    }
    if (!this.bucketId || !this.bucketName) {
      throw new Error("❌ BACKBLAZE_BUCKET_ID or BACKBLAZE_BUCKET_NAME is missing in .env");
    }

    const credentials = Buffer.from(`${this.keyId}:${this.appKey}`).toString("base64");
    console.log('🔑 Authorizing with Backblaze...', { keyId: this.keyId, bucketName: this.bucketName });

    const res = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      method: "GET",
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!res.ok) {
      throw new InternalServerErrorException(`Authorization failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    console.log('📡 Auth response:', { apiUrl: data.apiUrl, downloadUrl: data.downloadUrl });
    
    this.apiUrl = data.apiUrl;
    // Backblaze returns downloadUrl, but fallback to constructing it from apiUrl
    this.downloadUrl = data.downloadUrl || data.apiUrl.replace('//api', '//f');
    this.authToken = data.authorizationToken;
    this.authTokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours validity
  }

  /** Step 2 — Get Upload URL */
  private async getUploadUrl(): Promise<void> {
    if (!this.authToken || Date.now() > this.authTokenExpiry) {
      await this.authorize();
    }

    const res = await fetch(`${this.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        Authorization: this.authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId: this.bucketId }),
    });

    if (!res.ok) {
      throw new InternalServerErrorException(`Get upload URL failed: ${res.status} ${await res.text()}`);
    }

    const data = await res.json();
    this.uploadUrl = data.uploadUrl;
    this.uploadAuthToken = data.authorizationToken;
    this.uploadTokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours validity
  }

  /** Step 3 — Upload a File */
  public async uploadBuffer(buffer: Buffer, fileName: string): Promise<any> {
    console.log('🚀 uploadBuffer called with:', { fileName, hasBuffer: !!buffer, bufferSize: buffer?.length });
    
    // Ensure we have fresh environment variables
    if (!this.bucketName) {
      this.bucketName = process.env.BACKBLAZE_BUCKET_NAME;
    }

    console.log('🔍 Current state before upload:', {
      bucketName: this.bucketName,
      downloadUrl: this.downloadUrl,
      hasUploadUrl: !!this.uploadUrl,
      uploadTokenValid: this.uploadTokenExpiry > Date.now()
    });

    if (!this.uploadUrl || Date.now() > this.uploadTokenExpiry) {
      console.log('🔄 Getting new upload URL...');
      await this.getUploadUrl();
    }
  
    const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");
    console.log('📤 Uploading file:', { fileName, bucketName: this.bucketName, downloadUrl: this.downloadUrl });
  
    const mimeType =
  fileName.endsWith(".webm")
    ? "audio/webm"
    : fileName.endsWith(".mp3")
    ? "audio/mpeg"
    : "b2/x-auto";

const res = await fetch(this.uploadUrl, {
  method: "POST",
  headers: {
    Authorization: this.uploadAuthToken,
    "X-Bz-File-Name": encodeURIComponent(fileName),
    "Content-Type": mimeType, // 👈 proper MIME type
    "X-Bz-Content-Sha1": sha1,
    "Content-Length": buffer.length.toString(),
  },
  body: new Uint8Array(buffer),
});
 
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Upload failed:', { status: res.status, statusText: res.statusText, error: errorText });
      throw new InternalServerErrorException(`File upload failed: ${res.status} ${errorText}`);
    }
  
    let result;
    try {
      result = await res.json();
    } catch (jsonError) {
      const responseText = await res.text();
      console.error('❌ Failed to parse upload response as JSON:', responseText);
      throw new InternalServerErrorException(`Upload response parsing failed: ${responseText}`);
    }
  
    // Ensure we have the download URL - fallback if needed
    if (!this.downloadUrl && this.apiUrl) {
      console.log('⚠️ downloadUrl missing, using fallback from apiUrl');
      this.downloadUrl = this.apiUrl.replace('//api', '//f');
    }

    if (!this.downloadUrl || !this.bucketName) {
      console.error('❌ Critical values missing:', { 
        downloadUrl: this.downloadUrl, 
        bucketName: this.bucketName,
        apiUrl: this.apiUrl,
        authToken: this.authToken ? 'exists' : 'missing'
      });
      throw new InternalServerErrorException('Missing required values for file URL construction');
    }
  
    // Construct the public download URL
    const fileUrl = `${this.downloadUrl}/file/${this.bucketName}/${encodeURIComponent(fileName)}`;
    console.log('✅ File uploaded successfully:', { fileUrl });
    console.log('🔍 Debug values:', { 
      downloadUrl: this.downloadUrl, 
      bucketName: this.bucketName, 
      fileName: fileName,
      resultKeys: Object.keys(result)
    });
  
    return {
      ...result,
      fileUrl,
    };
  }

  /** Step 4 — Retrieve/Download a File */
  /** Step 6 — Generate temporary download URL for private buckets */
public async getSignedFileUrl(fileName: string, validSeconds = 3600): Promise<string> {
  if (!this.authToken || Date.now() > this.authTokenExpiry) {
    await this.authorize();
  }

  const res = await fetch(`${this.apiUrl}/b2api/v2/b2_get_download_authorization`, {
    method: "POST",
    headers: {
      Authorization: this.authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bucketId: this.bucketId,
      fileNamePrefix: fileName, // must match filename prefix
      validDurationInSeconds: validSeconds,
    }),
  });

  if (!res.ok) {
    throw new InternalServerErrorException(`Get signed URL failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  return `${this.downloadUrl}/file/${this.bucketName}/${encodeURIComponent(fileName)}?Authorization=${data.authorizationToken}`;
}

  /** Optional: Delete a File */
  public async deleteFile(fileName: string, fileId: string): Promise<void> {
    if (!this.authToken || Date.now() > this.authTokenExpiry) {
      await this.authorize();
    }

    const res = await fetch(`${this.apiUrl}/b2api/v2/b2_delete_file_version`, {
      method: "POST",
      headers: {
        Authorization: this.authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        fileName: fileName,
        fileId: fileId 
      }),
    });

    if (!res.ok) {
      throw new InternalServerErrorException(`File deletion failed: ${res.status} ${await res.text()}`);
    }
  }

  /** Optional: List Files in Bucket */
  public async listFiles(startFileName?: string, maxFileCount: number = 100): Promise<any> {
    if (!this.authToken || Date.now() > this.authTokenExpiry) {
      await this.authorize();
    }

    const body: any = { 
      bucketId: this.bucketId,
      maxFileCount 
    };
    
    if (startFileName) {
      body.startFileName = startFileName;
    }

    const res = await fetch(`${this.apiUrl}/b2api/v2/b2_list_file_names`, {
      method: "POST",
      headers: {
        Authorization: this.authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new InternalServerErrorException(`List files failed: ${res.status} ${await res.text()}`);
    }

    return res.json();
  }
}