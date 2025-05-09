import useSWR from "swr";

const fetcher = (url: string , token? :string) => fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  }).then((res) => res.json());

export const useFetch = (url: string , token? :string) => {
    const shouldFetch = url;
    const { data, error, isLoading, mutate } = useSWR(shouldFetch ?`http://localhost:5000/api/${url}` : null, (url) => fetcher(url,token));
    return {
        data,
        error,
        isLoading,
        mutate  
    };
} 