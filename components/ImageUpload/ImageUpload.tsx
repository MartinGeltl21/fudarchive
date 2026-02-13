'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
    dragText: string;
    hintText: string;
    errorText?: string;
    onFileSelect: (file: File) => void;
    onError: (error: string) => void;
}

const MAX_FILE_SIZE = 500 * 1024; // 500 KB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_WIDTH = 1400;

async function resizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
        const img = document.createElement('img');
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            if (img.width <= MAX_WIDTH) {
                resolve(file);
                return;
            }

            const canvas = document.createElement('canvas');
            const ratio = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = Math.round(img.height * ratio);

            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const resized = new File([blob], file.name, { type: file.type });
                        resolve(resized);
                    } else {
                        resolve(file);
                    }
                },
                file.type,
                0.75
            );
        };

        img.src = url;
    });
}

export default function ImageUpload({
    dragText,
    hintText,
    errorText,
    onFileSelect,
    onError,
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = async (file: File) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            onError('format');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            onError('size');
            return;
        }

        const resized = await resizeImage(file);
        const url = URL.createObjectURL(resized);
        setPreview(url);
        setFileName(resized.name);
        onFileSelect(resized);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleRemove = () => {
        setPreview(null);
        setFileName(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={styles.wrapper}>
            {preview ? (
                <div className={styles.previewWrapper}>
                    <div className={styles.previewImage}>
                        <Image src={preview} alt="Preview" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <div className={styles.previewInfo}>
                        <span className={styles.previewName}>{fileName}</span>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={handleRemove}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`${styles.dropzone} ${dragging ? styles.dragging : ''} ${errorText ? styles.error : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <div className={styles.dropzoneIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <p className={styles.dropzoneText}>{dragText}</p>
                    <p className={styles.dropzoneHint}>{hintText}</p>
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
                className={styles.hiddenInput}
            />

            {errorText && <p className="form-error">{errorText}</p>}
        </div>
    );
}
