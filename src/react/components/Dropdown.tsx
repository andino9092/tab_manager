import { useState } from "react";
import { TabData } from "./App";
import Tab from "./Tab";
import { motion, AnimatePresence } from "framer-motion"

export interface DropdownProps {
  tabGroupInfo: chrome.tabGroups.TabGroup;
  tabList: number[];
  tabs: TabData[];
  searchQuery: string;
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  setTabs: React.Dispatch<React.SetStateAction<TabData[]>>;
  groupId: number;
}

export default function Dropdown({
  tabGroupInfo,
  tabList,
  tabs,
  searchQuery,
  setSelected,
  setTabs,
  groupId,
}: DropdownProps) {
  const groupTabs = tabList.map((tabIndex: number) => tabs[tabIndex]);

  const [collapsed, setCollapsed] = useState<boolean>(true);

  const filteredTabs =
    searchQuery == ""
      ? groupTabs
      : groupTabs.filter(
          (tab: TabData) =>
            tab.tabInfo.title?.includes(searchQuery) ||
            tab.tabInfo.url?.includes(searchQuery)
        );
  if (filteredTabs.length == 0) {
    return <></>;
  }

  return (
    <div
      onClick={() => {
        setCollapsed((prev) => !prev);
      }}
    >
      <div className="ml-2">{tabGroupInfo.title}</div>
      <div>
        <AnimatePresence>
          {!collapsed &&
            filteredTabs.map((tab: TabData, i: number) => {
              return (
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        transition: {
                            staggerChildren: .5,
                        }
                    }}
                >
                  <Tab
                    className="pl-4 py-2 first:pt-0 last:pb-0  w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200"
                    style={{
                      backgroundColor: tab.selected ? "#a5b4fc" : "none",
                    }}
                    setSelected={setSelected}
                    setTabs={setTabs}
                    tab={tab}
                    i={i}
                  ></Tab>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
