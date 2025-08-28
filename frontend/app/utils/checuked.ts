export const getChunckedDatat=(arr:any [],chunck:number)=>{
    const allChuncks=[]
    for(let i =0;i<arr.length;i+=chunck){
        allChuncks.push(arr.slice(i))
    }
    
return allChuncks
}