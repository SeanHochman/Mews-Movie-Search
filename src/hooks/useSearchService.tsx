import React, { useEffect, useRef, useState } from 'react';
import { SearchService } from '../searchUtils/SearchService';
import { SearchResponse } from '../types';
import { useNavigate } from 'react-router';

export const useSearchService = ({
  query,
  page,
  searchType,
  queryParams,
}: {
  query?: string;
  page?: number;
  searchType?: string;
  queryParams?: Record<string, string>;
}) => {
  const [initialized, setInitialized] = useState(false);
  const [results, setResults] = useState<SearchResponse | undefined>();
  const searchServiceRef = useRef<any | undefined>();
  const navigate = useNavigate();

  const handleUpdate = (results: SearchResponse) => {
    setResults(results);
  };

  useEffect(() => {
    setInitialized(false);
    setResults(undefined);
    searchServiceRef.current?.abort;
    searchServiceRef.current = new SearchService();
    searchServiceRef.current.onResultsUpdate(handleUpdate);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || !query?.length) return;
    navigate('/');
    searchServiceRef.current.fetchMoviesByQuery(
      {
        query,
        page,
        language: 'en-US',
        ...queryParams,
      },
      searchType,
    );
  }, [query, page, searchType]);

  return { results };
};
