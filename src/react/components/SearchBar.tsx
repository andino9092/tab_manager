import { ChangeEvent } from "react";

export interface SearchBarProps{

    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>; 
}


// App is going to filter results based on searchBar 

export default function SearchBar({searchQuery, setSearchQuery}: SearchBarProps){


    console.log(searchQuery)

    return (
        <div>
            <input value={searchQuery} onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                setSearchQuery(e.target.value)
            }}></input>


        </div>
    )


}