// src/hooks/useDashboardUI.js

import { useState } from 'react';
import { DASHBOARD_CONSTANTS } from '../utils/constants';

export const useDashboardUI = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [saveSearchToggle, setSaveSearchToggle] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState(DASHBOARD_CONSTANTS.FILTER_TABS.DEFAULT);
  const [searchOption, setSearchOption] = useState("create");
  const [selectedSavedSearch, setSelectedSavedSearch] = useState(null);
  const [saveSearchFilters, setSaveSearchFilters] = useState({});

  const handleOpenFilter = () => {
    setActiveFilterTab(DASHBOARD_CONSTANTS.FILTER_TABS.DEFAULT);
    setSidebarToggle(true);
  };

  return {
    sidebarToggle,
    setSidebarToggle,
    saveSearchToggle,
    setSaveSearchToggle,
    activeFilterTab,
    setActiveFilterTab,
    searchOption,
    setSearchOption,
    selectedSavedSearch,
    setSelectedSavedSearch,
    saveSearchFilters,
    setSaveSearchFilters,
    handleOpenFilter
  };
};