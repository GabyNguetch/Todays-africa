// FICHIER: components/dashboard/new-article/Toolbar.tsx
"use client";

import React, { useRef } from 'react';
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
  const [isUploading, setIsUploading] = React.useState(false);

  if (!editor) return null;

  // -- LOGIQUE INSERTION IMAGE --
  const handleImageClick = () => {
    fileInputRef.current?.click(); // Déclenche le click sur l'input file caché
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        // 1. Upload vers le Backend
        const media = await ArticleService.uploadMedia(file);
        
        // 2. Insérer dans l'éditeur
        // On stocke l'ID technique dans un attribut data-media-id (IMPORTANT pour le Parser)
        editor.chain().focus().setImage({ 
            src: media.urlAcces, 
            alt: media.nomOriginal,
            title: media.nomOriginal, // Peut servir de légende temporaire
        }).run();

        // 2b. AJOUTER l'attribut data-media-id après coup (TipTap trick si setImage ne prend pas tout)
        // Mais idéalement configure ton Tiptap Image extension pour accepter les attributs custom.
        // Si ton extension Image ne le permet pas, le parseur utilisera le SRC comme fallback.
        // Une astuce est de mettre l'ID dans le 'title' ou 'alt' si tu n'as pas customisé Tiptap.
        // Ici on va faire une astuce JS simple sur le noeud DOM dans EditorContent ou ici via commande attr
        
        // Commande spécifique si Extension configurée (optionnel)
        const domImages = document.querySelectorAll(`img[src="${media.urlAcces}"]`);
        domImages.forEach(img => img.setAttribute('data-media-id', String(media.id)));

    } catch (err) {
        alert("Erreur upload image contenu");
        console.error(err);
    } finally {
        setIsUploading(false);
        // Reset input
        if(fileInputRef.current) fileInputRef.current.value = ""; 
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
        icon: isUploading ? Loader2 : ImageIcon, // Loader si en cours
        action: handleImageClick,
        isActive: false,
        label: "Image",
        specialClass: "text-[#3E7B52] dark:text-[#13EC13] hover:bg-green-50 dark:hover:bg-green-900/20"
    },
    {
        icon: Video, // Placeholder Video (même logique à implémenter si besoin)
        action: () => alert("Support Vidéo à venir dans cette démo"),
        isActive: false,
        label: "Video"
    },
    { divider: true },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), label: "Undo" },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), label: "Redo" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-10 backdrop-blur-sm">
        {/* Hidden Input File pour les images */}
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
            // TypeScript guard
            if (!btn.icon) return null;
            
            const Icon = btn.icon;
            return (
                <button
                    key={index}
                    onClick={btn.action}
                    title={btn.label}
                    disabled={isUploading && btn.label === 'Image'}
                    className={cn(
                        "p-2 rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-zinc-700 hover:shadow-sm hover:text-gray-900 dark:hover:text-white",
                        btn.isActive ? "bg-white dark:bg-zinc-700 text-[#3E7B52] dark:text-[#13EC13] shadow-sm font-bold" : "",
                        btn.specialClass
                    )}
                >
                    <Icon size={18} className={isUploading && btn.label === 'Image' ? "animate-spin" : ""} />
                </button>
            )
        })}
    </div>
  );
}