import { useEffect, useCallback } from 'react';
import { statisticsApi } from '../api/statisticsApi';
import { useStatisticsStore } from '../store/statisticsStore';

export const useStatistics = () => {
  const { 
    filters, 
    setDailyRevenue, 
    setMonthlyRevenue, 
    setTopProducts, 
    setLoading, 
    setError 
  } = useStatisticsStore();

  const fetchDailyRevenue = useCallback(async () => {
    try {
      const res = await statisticsApi.getDailyRevenue(filters.startDate, filters.endDate);
      setDailyRevenue(res.data);
    } catch (err) {
      setError('Lỗi khi tải doanh thu hàng ngày');
    }
  }, [filters.startDate, filters.endDate, setDailyRevenue, setError]);

  const fetchMonthlyRevenue = useCallback(async () => {
    try {
      const res = await statisticsApi.getMonthlyRevenue(filters.year);
      setMonthlyRevenue(res.data);
    } catch (err) {
      setError('Lỗi khi tải doanh thu hàng tháng');
    }
  }, [filters.year, setMonthlyRevenue, setError]);

  const fetchTopProducts = useCallback(async () => {
    try {
      const res = await statisticsApi.getTopProducts(filters.startDate, filters.endDate);
      setTopProducts(res.data);
    } catch (err) {
      setError('Lỗi khi tải top sản phẩm');
    }
  }, [filters.startDate, filters.endDate, setTopProducts, setError]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    await Promise.all([
      fetchDailyRevenue(),
      fetchMonthlyRevenue(),
      fetchTopProducts(),
    ]);
    setLoading(false);
  }, [fetchDailyRevenue, fetchMonthlyRevenue, fetchTopProducts, setLoading, setError]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return { fetchAllData };
};
