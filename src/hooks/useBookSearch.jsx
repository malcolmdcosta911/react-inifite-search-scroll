import { useEffect, useState } from "react";

const url = "http://openlibrary.org/search.json";

const useBookSearch = (query, pageNo) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); 
    const [hasMore, setHasMore] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        setBooks([]); //reset
    }, [query]);

    useEffect(() => {
        const controller = new AbortController(); //abort prev search so data doesnt show up in new
        const signal = controller.signal;
        (async () => {
            if (!query) return;
            console.log("useBookSearch query", query);

            try {
                setLoading(true);
                const response = await fetch(
                    url +
                    "?" +
                    new URLSearchParams({
                        q: query,
                        page: pageNo,
                        limit: 10, //limit results per page
                    }).toString(),
                    { signal }
                );

                if (!response.ok) throw new Error("error");

                // console.log("response", response);
                const data = await response.json();
                // console.log("data", data.docs .map(d => d.title) );

                setBooks((books) => {
                    return [...new Set([...books, ...data.docs.map((d) => d.title)])];
                });
                setHasMore(data.docs.length > 0);
                // setLoading(false)
            } catch (error) {
                console.error("error", error.message);
                if (error.name === "AbortError") return;
                setError(true);
            } finally {
                 setLoading(false);
            }
        })();

        return () => {
            console.log("prev useffect on new query");
            controller.abort();
        };
    }, [query, pageNo]);

    return { loading, books, error, hasMore };
};

export default useBookSearch;





// import { useEffect, useState } from 'react'
// import axios from 'axios'

// export default function useBookSearch(query, pageNumber) {
//   const [loading, setLoading] = useState(true) //when hook first called need loading true
//   const [error, setError] = useState(false)
//   const [books, setBooks] = useState([])
//   const [hasMore, setHasMore] = useState(false)

//   useEffect(() => {
//     setBooks([])
//   }, [query])

//   useEffect(() => {
//     setLoading(true)
//     setError(false)
//     let cancel
//     axios({
//       method: 'GET',
//       url: 'http://openlibrary.org/search.json',
//       params: { q: query, page: pageNumber },
//       cancelToken: new axios.CancelToken(c => cancel = c)
//     }).then(res => {
//       setBooks(prevBooks => {
//         return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
//       })
//       setHasMore(res.data.docs.length > 0)
//       setLoading(false)
//     }).catch(e => {
//       if (axios.isCancel(e)) return
//       setError(true)
//     })
//     return () => cancel()
//   }, [query, pageNumber])

//   return { loading, error, books, hasMore }
// }