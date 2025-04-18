import AddStoreModal from '@/components/store/modal/AddStoreModal';
import ErrorPage from './status/errorPage';
import LoadingPage from './status/loadindPage';
import StoreHeader from '@/components/store/StoreHeader';
import StoreList from '@/components/store/StoreList';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useStoreQuery } from '@/api/store/store.hooks';

const Store = () => {
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { useGetAllStores } = useStoreQuery();
  const { data, isLoading, isError, error, refetch } = useGetAllStores();

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
    if (!isModalOpen) {
      toast.dismiss();
      setIsDeleteMode(false);
    }
  };

  const handleToggleDeleteMode = () => {
    toast.dismiss();
    setIsDeleteMode((prev) => !prev);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!data || isError) {
    return <ErrorPage error={error as Error} resetError={() => refetch()} />;
  }

  return (
    <div className='flex h-[calc(100vh-65px)] items-center justify-center'>
      <div className='ml-[30px] flex w-[1080px] flex-col items-start gap-6'>
        <StoreHeader
          storeCount={data.stores.length || 0}
          isDeleteMode={isDeleteMode}
          onToggleDeleteMode={handleToggleDeleteMode}
        />

        <StoreList
          stores={data.stores}
          onToggleModal={handleToggleModal}
          isDeleteMode={isDeleteMode}
        />
      </div>

      {isModalOpen && <AddStoreModal onClose={handleToggleModal} />}
    </div>
  );
};

export default Store;
