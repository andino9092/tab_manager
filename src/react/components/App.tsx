import { useEffect, useLayoutEffect, useState } from "react";
import "../index.css";
import SearchBar from "./SearchBar";
import Tab from "./Tab";
import Dropdown from "./Dropdown";

export interface TabData {
  tabInfo: chrome.tabs.Tab;
  selected: boolean;
}

// Need to Collapse ungrouped tabs
// Add background color to tab groups that correspond with tabgroup Color
// Add closeSelected option for tabs
// 
// 
// 


export interface GroupInfo {
  [groupId: number]: {
    tabGroupInfo: chrome.tabGroups.TabGroup;
    // Represents list of tabs that are associated with the tabGroupID
    // The numbers in this array are the corresponding indices within tabs state in App component
    tabList: number[];
  };
}

export default function App() {
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  // Information on all the groups
  const [groupInfo, setGroupInfo] = useState<GroupInfo>();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const getTabs = async () => {
    let groupIds = new Set<number>();
    let tabList: { [key: number]: number[] } = {};

    const response = await chrome.tabs
      .query({ currentWindow: true })
      .then(async (data: chrome.tabs.Tab[]) => {
        setTabs(
          data.map((tab: chrome.tabs.Tab, i: number): TabData => {
            if (tab.groupId != -1) {
              groupIds.add(tab.groupId);
              if (!(tab.groupId in tabList)) {
                tabList[tab.groupId] = [];
              }
              tabList[tab.groupId].push(i);
            }
            return {
              tabInfo: tab,
              selected: false,
            };
          })
        );
      });
    const ids: number[] = [...groupIds];
    let groupPromises = ids.map((id) => chrome.tabGroups.get(id));
    const groupInfoData = await Promise.all(groupPromises);

    let info: GroupInfo = {};
    groupInfoData.forEach((data: chrome.tabGroups.TabGroup, i: number) => {
      info[ids[i]] = {
        tabGroupInfo: data,
        tabList: tabList[ids[i]],
      };
    });
    setGroupInfo(info);
  };

  const freeTabs = tabs.filter((tab: TabData) => tab.tabInfo.groupId == -1);

  useLayoutEffect(() => {
    getTabs();
  }, []);

  console.log(selected)
  return (
    <div className="flex font-inter">
      <div className="flex flex-row flex-wrap overflow-y-scroll overflow-x-hidden w-[300px] h-[300px] text-base divide-y ">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        ></SearchBar>
        {groupInfo &&
          Object.entries(groupInfo).map((entry, index) => {
            const [groupId, data] = entry;
            const { tabGroupInfo, tabList } = data;
            return (
              <Dropdown
                groupId={Number(groupId)}
                tabGroupInfo={tabGroupInfo}
                tabList={tabList}
                tabs={tabs}
                searchQuery={searchQuery}
                setSelected={setSelected}
                setTabs={setTabs}
              ></Dropdown>
            );
          })}
        <div className="pl-4 py-2 first:pt-0 last:pb-0  w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200">Ungrouped Tabs</div>
        {freeTabs.length != 0 &&
          freeTabs.map((tab: TabData, i: number) => {
            return (
              <Tab
                className="pl-4 py-2 first:pt-0 last:pb-0  w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200"
                style={{
                  backgroundColor: tab.selected ? "#a5b4fc" : "",
                }}
                setSelected={setSelected}
                setTabs={setTabs}
                tab={tab}
                i={i}
              ></Tab>
            );
          })}
        <div className="flex w-full justify-center">
          <button
            className="grow p-4 hover:bg-green-500 hover:text-white transition-all"
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
          <button
            className="grow p-4 hover:bg-red-500 hover:text-white transition-all"
            onClick={async () => {
              await chrome.tabs.remove(selected)
              setSelected([]);
              getTabs();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
