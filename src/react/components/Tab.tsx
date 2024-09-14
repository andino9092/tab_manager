import { TabData } from "./App";

export interface TabProps {
  tab: TabData;
  style: React.CSSProperties;
  className: string;
  i: number;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  setTabs: React.Dispatch<React.SetStateAction<TabData[]>>;
}

export default function Tab({
  tab,
  i,
  setSelected,
  setTabs,
  className,
  style,
}: TabProps) {
  return (
    <div
      className={className}
      style={style}
      onClick={() => {
        if (!tab.selected) {
          setTabs((prev: TabData[]) =>
            prev.map((tab: TabData, index: number) => {
              return index == i
                ? {
                    ...tab,
                    selected: true,
                  }
                : tab;
            })
          );
          // Number casting will not work for querying foreign tabs
          setSelected((prev: number[]) => [...prev, Number(tab.tabInfo.id)]);
        } else {
          setTabs((prev: TabData[]) =>
            prev.map((tab: TabData, index: number) => {
              return index == i
                ? {
                    ...tab,
                    selected: false,
                  }
                : tab;
            })
          );
          setSelected((prev) =>
            prev.filter((item: number): boolean => item != tab.tabInfo.id)
          );
        }
      }}
    >
      <div className="flex justify-start gap-4 flex-row truncate">
        <img
          src={tab.tabInfo.favIconUrl}
          width={20}
          height={20}
          alt="favicon"
        ></img>

        {tab.tabInfo.title}
      </div>
    </div>
  );
}
