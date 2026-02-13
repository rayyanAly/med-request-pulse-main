import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { startReferenceDataPolling } from '@/redux/actions/referenceDataActions';
import { fetchManufacturers } from '@/redux/actions/manufacturerActions';

const ReferenceDataProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch manufacturers once on app load
    dispatch(fetchManufacturers() as any);
    
    // Start polling for reference data
    dispatch(startReferenceDataPolling() as any);

    // Cleanup interval on unmount
    return () => {
      const intervalId = (window as any).__referenceDataInterval;
      if (intervalId) {
        clearInterval(intervalId);
        delete (window as any).__referenceDataInterval;
      }
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default ReferenceDataProvider;