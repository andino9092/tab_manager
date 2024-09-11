import { useEffect, useState } from "react";
import "../index.css";

interface Tab {
  tabInfo: chrome.tabs.Tab;
  selected: boolean;
}

interface GroupInfo {
  [groupId: number]: chrome.tabGroups.TabGroup;
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>();
  const [selected, setSelected] = useState<number[]>([]);
  const [groupInfo, setGroupInfo] = useState<GroupInfo>({});

  const getTabs = async () => {
    let groupIds: number[] = [];
    const response = await chrome.tabs
      .query({ currentWindow: true })
      .then(async (data: chrome.tabs.Tab[]) => {
        setTabs(
          data.map((tab: chrome.tabs.Tab): Tab => {
            if (tab.groupId != -1) {
              groupIds.push(tab.groupId);
            }
            return {
              tabInfo: tab,
              selected: false,
            };
          })
        );

      });
      let groupPromises = groupIds.map(id => chrome.tabGroups.get(id))
      const groupInfoData = await Promise.all(groupPromises);

      let info: GroupInfo = {};
      groupInfoData.forEach((data: chrome.tabGroups.TabGroup, i: number) => {
        info[groupIds[i]] = data
      })
      setGroupInfo(info);
  };

  console.log(groupInfo);

  useEffect(() => {
    getTabs();
  }, []);

  return (
    <div className="flex font-inter">
      <div className="flex flex-wrap overflow-y-scroll overflow-x-hidden w-[300px] h-[300px] text-base divide-y ">
        {tabs && groupInfo && 
          tabs.map((tab: Tab, i: number) => {
            // if (tab.tabInfo.groupId != -1){
            //   console.log(groupInfo[tab.tabInfo.groupId].color)
            // }
              
            return (
              <div
                className="pl-4 py-2 first:pt-0 last:pb-0  w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200"
                style={{
                  backgroundColor: tab.selected ? "#a5b4fc" : "none",
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
                <div className="flex justify-start gap-4 flex-row truncate">
                  <img
                    src={tab.tabInfo.favIconUrl}
                    width={20}
                    height={20}
                    alt="favicon"
                  ></img>

                  {tab.tabInfo.title}
                </div>
                {/* {tab.tabInfo.groupId != -1 &&  groupInfo && 
              <div className="w-[20px] h-[20px] rounded-full" style={{backgroundColor: groupInfo[tab.tabInfo.groupId].color}}> 
                
                
                </div>} */}
              </div>
            );
          })}
        <div className="flex w-full justify-center gap-4">
          <button
            className="grow p-4 hover:bg-indigo-500 hover:text-white transition-all"
            onClick={async () => {
              await chrome.tabs.group({
                tabIds: selected,
              });
              setSelected([]);
              getTabs();
            }}
          >
            Group
          </button>
          <button
            className="grow p-4 hover:bg-indigo-500 hover:text-white transition-all"
            onClick={async () => {
              await chrome.tabs.ungroup(selected);
              setSelected([]);
              getTabs();
            }}
          >
            Ungroup
          </button>
        </div>
      </div>
    </div>
  );
}
