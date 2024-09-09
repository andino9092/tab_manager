import { useEffect, useState } from "react";
import './index.css'

export default function App() {
  const [tabs, setTabs] = useState<any[]>();
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    const getTabs = async () => {
      const response = await chrome.tabs
        .query({ currentWindow: true })
        .then((data: any) => {
          setTabs(data);
        });
    };

    getTabs();
  }, []);

  console.log(selected)

  return (
    <div>
      {tabs &&
        tabs.map((tab: any) => {
          return (
            <div className="websites flex"
              onClick={() => {
                if (tab.groupId == -1) {
                  setSelected([...selected, tab.id]);
                } else {
                  const filtered = selected.filter((val) => val != tab.id);
                  setSelected(filtered);
                }
              }}
            >
              {tab.title} {tab.groupId}
            </div>
          );
        })}
        <button onClick={() => {
            chrome.tabs.group({tabIds: selected})
            setSelected([])
        }}>
            Group
        </button>
    </div>
  );
}