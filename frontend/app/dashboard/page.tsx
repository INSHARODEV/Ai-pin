import React from "react";
import Header from "../_componentes/reusable/Header";
import StatusCard from "../_componentes/reusable/StatusCard";
import Table from "../_componentes/reusable/Table";
import { data, headers } from "../utils/staticData";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <section className="p-10 bg-[rgb(249,250,251)]   rounded-md">
        <div className="justify-between items-center ">
          <h2 className=" font-bold text-3xl my-10">Welcome back, John Doe!</h2>
          <span className=" text-gray-400">
            {new Date(Date.now()).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex gap-4 ">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <StatusCard key={i} rating={5} incresing={true} title="metrics" />
            ))}

          {/*  start recoridng button */}
          {/* shift table */}
        </div>
        <div>
          <h2 className="text-3xl my-10">Last 7 DAYS SHIFT</h2>
        </div>
        <Table data={data} headers={headers} key={Math.random() * 10000000} />
      </section>
    </div>
  );
}
