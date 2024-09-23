import { useState } from "react";
import { TabData } from "./App";
import Tab from "./Tab";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="w-full">
      <div
        onClick={() => {
          setCollapsed((prev) => !prev);
        }}
        className="pl-4 py-2 first:pt-0 last:pb-0 relative w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200"
      >
        {tabGroupInfo.title}
        <div
          className="rounded-full w-[10px] h-[10px] absolute right-[30px]"
          style={{
            backgroundColor: tabGroupInfo.color,
          }}
        ></div>
      </div>
      <div className="divide-y">
        <AnimatePresence>
          {!collapsed && (
            <div>
              {filteredTabs.length != 0 &&
                filteredTabs.map((tab: TabData, i: number) => {
                  return (
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.5,
                        },
                      }}
                      className="relative"
                    >
                      <Tab
                        className="pl-4 py-2 first:pt-0 last:pb-0 w-full h-[50px] transition-all flex flex-col justify-center hover:bg-indigo-200"
                        style={{
                          backgroundColor: tab.selected ? "#a5b4fc" : "",
                        }}
                        setSelected={setSelected}
                        setTabs={setTabs}
                        tab={tab}
                        i={i}
                      ></Tab>
                    </motion.div>
                  );
                })}
              {filteredTabs.length == 0 && (
                <div className="py-2">No filtered tabs...</div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
