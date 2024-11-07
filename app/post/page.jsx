"use client"
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Pencil, Trash2, Loader, Image as ImageIcon, Plus, X } from 'lucide-react';
import firebaseConfig from '@/firebase.config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      
      if (image) {
        const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      if (editingId) {
        const postRef = doc(db, 'posts', editingId);
        await updateDoc(postRef, {
          title,
          content,
          ...(imageUrl && { imageUrl }),
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'posts'), {
          title,
          content,
          imageUrl,
          createdAt: new Date().toISOString()
        });
      }

      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      setEditingId(null);
      setIsFormOpen(false);
      await fetchPosts();
    } catch (error) {
      console.error('Error creating/updating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        if (imageUrl) {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        }
        await deleteDoc(doc(db, 'posts', postId));
        await fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setImagePreview(post.imageUrl);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800">Farmers Network</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Post</span>
          </button>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                      setTitle('');
                      setContent('');
                      setImagePreview(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      rows="6"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border-2 border-dashed border-emerald-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
                        <ImageIcon className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-600">Choose Image</span>
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{editingId ? 'Update Post' : 'Create Post'}</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.imageUrl)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                
                <div className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;