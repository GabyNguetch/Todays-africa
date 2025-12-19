"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface EditorProps {
  setEditorRef: (editor: any) => void;
  onChange: (html: string) => void;
  initialContent?: string; // Ajout de la prop
}

export default function EditorContentComp({ setEditorRef, onChange, initialContent }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Désactive l'extension CodeBlock par défaut si besoin
      }),
      // Configuration explicite Link qui est standard
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
            class: 'rounded-lg border border-gray-100 shadow-sm max-w-full my-4 block',
        },
      }),
      Placeholder.configure({
        placeholder: "Commencez votre article...",
      })
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 min-h-[500px]',
        },
        transformPastedHTML(html) { return html; }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      setEditorRef(editor);
    },
  });

  useEffect(() => {
    return () => {
        if (editor) editor.destroy();
    }
  }, [editor]);

  // Correction ici : On utilise la variable 'initialContent' destructurée, pas 'props.initialContent'
  useEffect(() => {
    if (editor && initialContent) {
        // On ne set le contenu que si l'éditeur est vide pour ne pas écraser une saisie en cours en cas de re-render
        if(editor.isEmpty) {
            editor.commands.setContent(initialContent);
        }
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
            Chargement de votre éditeur...
        </div>
    );
  }

  return (
    <div className="flex-1 bg-white dark:bg-zinc-900 cursor-text" onClick={() => editor?.chain().focus().run()}>
      <EditorContent editor={editor} />
    </div>
  );
}