import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { cn } from "../../lib/utils";

const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CalendarDay: React.FC<{ day: number | string; isHeader?: boolean }> = ({ day, isHeader }) => {
  const randomBgWhite = !isHeader && Math.random() < 0.3 ? "bg-indigo-500 text-white" : "text-text-tertiary";
  return (
    <div className={`col-span-1 row-span-1 flex h-8 w-8 items-center justify-center ${isHeader ? "" : "rounded-xl"} ${randomBgWhite}`}>
      <span className={`font-medium ${isHeader ? "text-xs" : "text-sm"}`}>{day}</span>
    </div>
  );
};

export function Calendar() {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();

  const renderCalendarDays = () => {
    let days: React.ReactNode[] = [
      ...dayNames.map((day, i) => <CalendarDay key={`header-${day}`} day={day} isHeader />),
      ...Array(firstDayOfWeek).fill(null).map((_, i) => <div key={`empty-start-${i}`} className="col-span-1 row-span-1 h-8 w-8" />),
      ...Array(daysInMonth).fill(null).map((_, i) => <CalendarDay key={`date-${i + 1}`} day={i + 1} />),
    ];
    return days;
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border-primary bg-bg-primary p-6 overflow-hidden">
      <div className="grid h-full gap-5">
        <div>
          <h2 className="mb-4 text-lg md:text-3xl font-semibold text-white">Any questions?</h2>
          <p className="mb-2 text-xs md:text-sm text-gray-400">Feel free to reach out!</p>
          <Button className="mt-3 rounded-2xl">Book Now</Button>
        </div>
        <div className="transition-all duration-500 ease-out">
          <div className="h-full w-full rounded-[24px] border border-border-primary p-2">
            <div className="h-full rounded-2xl border-2 border-[#A5AEB81F]/10 p-3" style={{ boxShadow: "0px 2px 1.5px 0px #A5AEB852 inset" }}>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-white"><span className="font-medium">{currentMonth}, {currentYear}</span></p>
                <span className="h-1 w-1 rounded-full">&nbsp;</span>
                <p className="text-xs text-gray-400">30 min call</p>
              </div>
              <div className="mt-4 grid grid-cols-7 grid-rows-5 gap-2 px-4">{renderCalendarDays()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BentoCard({ children, height = "h-auto", className = "", linkTo }: { children: React.ReactNode; height?: string; className?: string; linkTo?: string }) {
  const cardContent = (
    <div className={`group relative flex flex-col rounded-2xl border border-border-primary bg-bg-primary p-6 overflow-hidden ${height} ${className}`}>
      {children}
    </div>
  );
  if (linkTo) {
    return linkTo.startsWith("/") ? <Link to={linkTo} className="block">{cardContent}</Link> : <a href={linkTo} target="_blank" rel="noopener noreferrer" className="block">{cardContent}</a>;
  }
  return cardContent;
}
