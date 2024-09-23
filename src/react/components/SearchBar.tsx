import { ChangeEvent } from "react";

export interface SearchBarProps{

    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>; 
}


// App is going to filter results based on searchBar 

export default function SearchBar({searchQuery, setSearchQuery}: SearchBarProps){


    return (
        <div>
            <input className="w-full mx-2 my-3 py-1  transition-all outline-none border-b-2 border-gray-300 hover:border-gray-500 focus:border-gray-700" placeholder='Search...' value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                setSearchQuery(e.target.value)
            }}></input>

        </div>
    )


}