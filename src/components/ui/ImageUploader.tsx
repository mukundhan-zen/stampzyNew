
'use client';

import { useState } from 'react';
import { Input } from './input';
import { Button } from './button';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle, X } from 'lucide-react';

const MAX_FILES = 3;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/webp'];

export function ImageUploader({ onFilesChange }: { onFilesChange: (files: File[]) => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (files.length + selectedFiles.length > MAX_FILES) {
      setError(`You can only upload a maximum of ${MAX_FILES} images.`);
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File "${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`);
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError(`File "${file.name}" has an invalid type. Only JPEG and WebP are allowed.`);
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    const updatedFiles = [...files, ...newFiles];
    const updatedPreviews = [...previews, ...newPreviews];
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange(updatedFiles);
    setError(null);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]); // Clean up memory
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  return (
    <div className='space-y-4'>
        <div>
            <label htmlFor='file-upload' className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                Upload Images (up to 3)
            </label>
            <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md'>
                <div className='space-y-1 text-center'>
                    <svg className='mx-auto h-12 w-12 text-gray-400' stroke='currentColor' fill='none' viewBox='0 0 48 48' aria-hidden='true'>
                        <path d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                    <div className='flex text-sm text-gray-600 dark:text-gray-400'>
                        <label htmlFor='file-upload' className='relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'>
                            <span>Upload a file</span>
                            <Input id='file-upload' name='file-upload' type='file' className='sr-only' multiple onChange={handleFileChange} accept={ALLOWED_FILE_TYPES.join(',')} disabled={files.length >= MAX_FILES}/>
                        </label>
                        <p className='pl-1'>or drag and drop</p>
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-500'>WebP, JPEG up to {MAX_FILE_SIZE_MB}MB</p>
                </div>
            </div>
        </div>

        {error && (
            <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {previews.length > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {previews.map((src, index) => (
                    <div key={index} className='relative group'>
                        <Image src={src} alt={`Preview ${index + 1}`} width={200} height={200} className='w-full h-auto rounded-lg' />
                        <Button variant='destructive' size='icon' className='absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity' onClick={() => handleRemoveImage(index)}>
                            <X className='h-4 w-4' />
                            <span className='sr-only'>Remove image</span>
                        </Button>
                    </div>
                ))}
            </div>
        )}

        <div className='text-xs text-gray-500 dark:text-gray-400'>
            <p className='font-semibold'>Image Guidelines:</p>
            <ul className='list-disc list-inside'>
                <li>Lighting: Use bright, indirect natural light. Avoid shadows.</li>
                <li>Orientation: Place the stamp on a neutral, plain background.</li>
                <li>Capture: Ensure the entire stamp is in focus and fills the frame.</li>
            </ul>
        </div>
    </div>
  );
}
