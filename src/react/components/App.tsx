import { useEffect, useState } from "react";
import "../index.css";

interface Tab {
  tabInfo: chrome.tabs.Tab;
  selected: boolean;
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>();
  const [selected, setSelected] = useState<number[]>([]);

  const getTabs = async () => {
    const response = await chrome.tabs
      .query({ currentWindow: true })
      .then((data: chrome.tabs.Tab[]) => {
        setTabs(
          data.map((tab: chrome.tabs.Tab): Tab => {
            return {
              tabInfo: tab,
              selected: false,
            };
          })
        );
      });
  };

  useEffect(() => {
    getTabs();
  }, []);

  return (
    <div className="flex font-inter">
      <div className="flex flex-wrap overflow-y-scroll w-[300px] h-[300px] text-base divide-y ">
        {tabs &&
          tabs.map((tab: Tab, i: number) => (
            <div
              className="pl-4 py-2 first:pt-0 last:pb-0  w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200 truncate"
              style={{
                backgroundColor: tab.selected ? '#a5b4fc': 'none'
              }}
              onClick={() => {
                if (!tab.selected) {
                  setTabs(
                    tabs.map((tab: Tab, index: number) => {
                      return index == i
                      ? {
                        ...tab,
                        selected: true,
                      }
                      : tab;
                    })
                  );
                  // Number casting will not work for querying foreign tabs
                  setSelected([...selected, Number(tab.tabInfo.id)]);
                } else {
                  setTabs(
                    tabs.map((tab: Tab, index: number) => {
                      return index == i
                        ? {
                            ...tab,
                            selected: false,
                          }
                        : tab;
                    })
                  );
                  setSelected(
                    selected.filter(
                      (item: number): boolean => item != tab.tabInfo.id
                    )
                  );
                }
              }}
            >
              {tab.tabInfo.title}
            </div>
          ))}
        <button
          onClick={() => {
            chrome.tabs.group({
              tabIds: selected,
            });
            setSelected([]);
            getTabs();
          }}
        >
          Group
        </button>
        <button
          onClick={() => {
            chrome.tabs.ungroup(selected);
            setSelected([]);
            getTabs();
          }}
        >
          Ungroup
        </button>
      </div>
    </div>
  );
}
