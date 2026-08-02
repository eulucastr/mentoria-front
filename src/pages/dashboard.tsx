import { ChartAreaInteractive } from "@/components/molecules/chart-area-interactive";
import { DataTable } from "@/components/molecules/data-table";
import { SectionCards } from "@/components/molecules/section-cards";
import data from "./dashboard.data.json"

export function Dashboard() {

  return (
    <div className="p-8 text-white">
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
