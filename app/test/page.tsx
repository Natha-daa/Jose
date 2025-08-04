'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'audio' | 'video'>('audio');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append(type, file);

    const res = await fetch('/api/media', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      alert('Upload réussi ✅');
      setName('');
      setDescription('');
      setFile(null);
    } else {
      alert('Erreur lors de l\'upload');
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Uploader un média</h1>
      <form className="space-y-4">
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Type :</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'audio' | 'video')}
            className="border p-2 w-full"
          >
            <option value="audio">Audio</option>
            <option value="video">Vidéo</option>
          </select>
        </div>

        <div>
          <label>Fichier :</label>
          <input
            type="file"
            accept={type === 'audio' ? 'audio/*' : 'video/*'}
            onChange={(e) => {
              if (e.target.files) setFile(e.target.files[0]);
            }}
            required
            className="border p-2 w-full"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </form>
    </main>
  );
}
