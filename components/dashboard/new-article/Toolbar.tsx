// FICHIER: components/dashboard/new-article/Toolbar.tsx - VERSION CORRIGÉE PREVIEW LOCAL

"use client";

import React, { useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, Quote, 
  List, ListOrdered, Image as ImageIcon, Video, Undo, Redo, 
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ArticleService } from '@/services/article';

interface ToolbarProps {
  editor: Editor | null;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!editor) return null;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
        console.group("📷 [Toolbar] Upload Image Contenu");
        console.log("Fichier:", file.name, `(${file.size} bytes)`);
        
        // ✅ PREVIEW LOCAL IMMÉDIAT
        const localUrl = URL.createObjectURL(file);
        console.log("🖼️ Preview local:", localUrl);
        
        // Insérer immédiatement l'image avec URL locale
        editor.chain().focus().setImage({ 
            src: localUrl, 
            alt: file.name,
            title: file.name
        }).run();

        // Marquer temporairement l'image comme "en cours d'upload"
        setTimeout(() => {
            const images = document.querySelectorAll(`img[src="${localUrl}"]`);
            images.forEach(img => {
                img.setAttribute('data-uploading', 'true');
                img.classList.add('article-content-image', 'opacity-50', 'animate-pulse');
            });
        }, 50);
        
        // Upload vers le backend en arrière-plan
        const media = await ArticleService.uploadMedia(file);
        
        console.log("✅ Média reçu:", media);
        console.log("🆔 UUID:", media.id);
        console.log("🔗 URL serveur:", media.urlAcces);

        // Remplacer l'URL locale par l'URL serveur
        setTimeout(() => {
            const images = document.querySelectorAll(`img[src="${localUrl}"]`);
            
            images.forEach(img => {
                // Remplacer src
                img.setAttribute('src', media.urlAcces);
                
                // Stocker l'UUID
                img.setAttribute('data-media-id', String(media.id));
                
                // Retirer indicateurs de chargement
                img.removeAttribute('data-uploading');
                img.classList.remove('opacity-50', 'animate-pulse');
                img.classList.add("article-content-image");
                
                console.log(`✅ Image mise à jour avec URL serveur et UUID: ${media.id}`);
            });
            
            // Libérer l'URL locale
            URL.revokeObjectURL(localUrl);
            
            console.log(`✅ ${images.length} image(s) mise(s) à jour avec URL serveur`);
        }, 100);

        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
        
        console.groupEnd();

    } catch (err) {
        console.error("❌ Erreur upload image contenu:", err);
        console.groupEnd();
        alert("Erreur lors de l'upload. Vérifiez le format/taille du fichier.");
        
        // En cas d'erreur, retirer l'image du document
        // (À améliorer avec une gestion plus fine si nécessaire)
    } finally {
        setIsUploading(false);
        if(fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  const addYoutube = () => {
    const url = prompt('Entrez l\'URL YouTube');
    if (url) {
      editor.commands.setContent(`${editor.getHTML()}<p>URL Vidéo: ${url}</p>`); 
    }
  };

  const buttons = [
    { 
        icon: Bold, 
        action: () => editor.chain().focus().toggleBold().run(), 
        isActive: editor.isActive('bold'),
        label: "Gras" 
    },
    { 
        icon: Italic, 
        action: () => editor.chain().focus().toggleItalic().run(), 
        isActive: editor.isActive('italic'),
        label: "Italique" 
    },
    { 
        icon: Strikethrough, 
        action: () => editor.chain().focus().toggleStrike().run(), 
        isActive: editor.isActive('strike'),
        label: "Barré" 
    },
    { divider: true },
    { 
        icon: Heading1, 
        action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 
        isActive: editor.isActive('heading', { level: 1 }),
        label: "H1"
    },
    { 
        icon: Heading2, 
        action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 
        isActive: editor.isActive('heading', { level: 2 }),
        label: "H2"
    },
    { divider: true },
    { 
        icon: Quote, 
        action: () => editor.chain().focus().toggleBlockquote().run(), 
        isActive: editor.isActive('blockquote'),
        label: "Citation"
    },
    { 
        icon: List, 
        action: () => editor.chain().focus().toggleBulletList().run(), 
        isActive: editor.isActive('bulletList'),
        label: "Liste Puce"
    },
    { 
        icon: ListOrdered, 
        action: () => editor.chain().focus().toggleOrderedList().run(), 
        isActive: editor.isActive('orderedList'),
        label: "Liste Num."
    },
    { divider: true },
    {
        icon: isUploading ? Loader2 : ImageIcon,
        action: handleImageClick,
        isActive: uploadSuccess,
        label: "Image",
        specialClass: uploadSuccess 
            ? "text-green-600 bg-green-50 dark:bg-green-900/20" 
            : "text-[#3E7B52] dark:text-[#13EC13] hover:bg-green-50 dark:hover:bg-green-900/20"
    },
    { 
        icon: Video, 
        action: addYoutube, 
        isActive: false, 
        label: "Vidéo Youtube" 
    },
    { divider: true },
    { 
        icon: Undo, 
        action: () => editor.chain().focus().undo().run(), 
        label: "Annuler",
        disabled: !editor.can().undo()
    },
    { 
        icon: Redo, 
        action: () => editor.chain().focus().redo().run(), 
        label: "Rétablir",
        disabled: !editor.can().redo()
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
        />

        {buttons.map((btn, index) => {
            if (btn.divider) {
                return <div key={index} className="w-px h-6 bg-gray-200 dark:bg-zinc-700 mx-2" />;
            }
            
            if (!btn.icon) return null;
            
            const Icon = btn.icon;
            const isDisabled = btn.disabled || (isUploading && btn.label === 'Image');
            
            return (
                <button
                    key={index}
                    onClick={btn.action}
                    title={btn.label}
                    disabled={isDisabled}
                    className={cn(
                        "p-2 rounded-md transition-all text-gray-500 dark:text-gray-400",
                        "hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm hover:text-gray-900 dark:hover:text-white",
                        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                        btn.isActive ? "bg-white dark:bg-zinc-700 text-[#3E7B52] dark:text-[#13EC13] shadow-sm font-bold" : "",
                        btn.specialClass
                    )}
                >
                    <Icon 
                        size={18} 
                        className={isUploading && btn.label === 'Image' ? "animate-spin" : ""} 
                    />
                </button>
            )
        })}

        {uploadSuccess && (
            <div className="ml-auto flex items-center gap-2 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-2">
                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                Image ajoutée !
            </div>
        )}
    </div>
  );
}