'use client';

import { Toast } from 'flowbite-react';
import { useRef, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import { CustomToast } from './components/CustomToast';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hasResponse, setHasResponse] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasResponse(false);
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    try {
      setHasResponse(false);
      setErrorMessage(null);
      if (!file) {
        console.error('No file selected.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      console.log('called');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setHasResponse(true);
      response.body;
      if (response.ok) {
        console.debug('File uploaded successfully!');
        setFile(null);
        fileInputRef.current!.value = '';
      } else {
        setErrorMessage('Failed to upload image.');
        console.error('Failed to upload image.');
      }
    } catch (error) {
      setErrorMessage(error as string);
      console.error(error);
    }
  };

  const convertBytesToMbsOrKbs = (bytes: number, decimals = 2) => {
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <main className='flex min-h-screen flex-col items-center text-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center  font-mono  lg:flex'>
        <div className='lg:flex'></div>
        <div></div>
      </div>
      <div className='w-full justify-center m-3'>
        <h1 className='text-5xl'>Image uploads</h1>
      </div>
      <div className='w-full  justify-center m-3'>
        <h2 className='text-3xl'>Single file</h2>
        {file && (
          <div>
            <p>File name: {file.name}</p>

            <p>File size: {convertBytesToMbsOrKbs(file.size)}</p>
            <p>File type: {file.type}</p>
          </div>
        )}
        <input type='file' onChange={handleFileChange} ref={fileInputRef} />
        <br />

        <button
          className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mt-5 rounded-lg text-lg'
          onClick={() => handleImageUpload()}
        >
          Upload File
        </button>
      </div>
      {hasResponse && !errorMessage ? (
        <CustomToast>
          <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
            <HiCheck className='h-5 w-5' />
          </div>
          <div className='ml-3 text-sm font-normal'>
            File uploaded successfully.
          </div>
          <Toast.Toggle />
        </CustomToast>
      ) : null}
      {hasResponse && errorMessage ? (
        <CustomToast>
          <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'>
            <HiX className='h-5 w-5' />
          </div>
          <div className='ml-3 text-sm font-normal'>
            Upload fail. Error: {errorMessage}.
          </div>
          <Toast.Toggle />
        </CustomToast>
      ) : null}
    </main>
  );
}
