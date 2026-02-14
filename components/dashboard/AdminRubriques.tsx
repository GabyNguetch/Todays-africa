// FICHIER: components/dashboard/AdminRubriques.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { 
  FolderTree, Plus, Edit, Trash2, RefreshCw, Eye, EyeOff, 
  ChevronDown, ChevronRight, Loader2, AlertCircle, X, Check,
  FolderOpen, Save
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Rubrique } from '@/types/article';
import { RubriqueService } from '@/services/rubrique';

interface RubriqueFormData {
  nom: string;
  description: string;
  slug: string;
  parentId: number | null;
  icone: string;
  couleur: string;
  visible: boolean;
  ordre: number;
}

const EMPTY_FORM: RubriqueFormData = {
  nom: '',
  description: '',
  slug: '',
  parentId: null,
  icone: '📁',
  couleur: '#3E7B52',
  visible: true,
  ordre: 0
};

export default function AdminRubriques() {
  // === STATE ===
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<RubriqueFormData>(EMPTY_FORM);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // === CHARGEMENT INITIAL ===
  useEffect(() => {
    loadRubriques();
  }, []);

  const loadRubriques = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RubriqueService.getAll();
      setRubriques(data);
      
      // Expand root items by default
      const rootIds = data.filter(r => !r.parentId).map(r => r.id);
      setExpandedIds(new Set(rootIds));
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // === ARBRE HIÉRARCHIQUE ===
  const buildTree = (items: Rubrique[]): Rubrique[] => {
    const map = new Map<number, Rubrique>();
    const roots: Rubrique[] = [];

    items.forEach(item => {
      map.set(item.id, { ...item, enfants: [] });
    });

    items.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.enfants!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  const tree = buildTree(rubriques);

  // === FILTRAGE ===
  const filteredRubriques = searchTerm
    ? rubriques.filter(r => 
        r.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : tree;

  // === EXPAND/COLLAPSE ===
  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  // === MODAL ===
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (rubrique: Rubrique) => {
    setEditingId(rubrique.id);
    setFormData({
      nom: rubrique.nom,
      description: rubrique.description || '',
      slug: rubrique.slug || '',
      parentId: rubrique.parentId || null,
      icone: rubrique.icone || '📁',
      couleur: rubrique.couleur || '#3E7B52',
      visible: rubrique.visible !== false,
      ordre: rubrique.ordre || 0
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  // === ACTIONS CRUD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim()) {
      alert('Le nom est requis');
      return;
    }

    try {
      if (editingId) {
        await RubriqueService.update(editingId, formData);
      } else {
        await RubriqueService.create(formData);
      }
      
      await loadRubriques();
      closeModal();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('⚠️ Confirmer la suppression ?\n\nLes sous-rubriques seront également supprimées.')) {
      return;
    }

    setActionLoading(id);
    try {
      await RubriqueService.delete(id);
      await loadRubriques();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVisibility = async (id: number, currentVisible: boolean) => {
    setActionLoading(id);
    try {
      await RubriqueService.toggleVisibility(id, !currentVisible);
      await loadRubriques();
    } catch (e: any) {
      alert(e.message || 'Erreur lors de la modification');
    } finally {
      setActionLoading(null);
    }
  };

  // === AUTO-SLUG ===
  const handleNomChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      nom: value,
      slug: value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }));
  };

  // === RENDER TREE ===
  const renderRubriqueTree = (items: Rubrique[], level = 0) => {
    return items.map((rubrique) => {
      const hasChildren = rubrique.enfants && rubrique.enfants.length > 0;
      const isExpanded = expandedIds.has(rubrique.id);
      const isActionLoading = actionLoading === rubrique.id;

      return (
        <React.Fragment key={rubrique.id}>
          <tr className="group hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-gray-100 dark:border-zinc-800">
            {/* Nom avec indentation */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(rubrique.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                )}
                
                {!hasChildren && <div className="w-6" />}
                
                <span className="text-xl mr-2">{rubrique.icone || '📁'}</span>
                
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {rubrique.nom}
                  </span>
                  {rubrique.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {rubrique.description}
                    </span>
                  )}
                </div>
              </div>
            </td>

            {/* Slug */}
            <td className="px-6 py-4">
              <code className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                {rubrique.slug || '-'}
              </code>
            </td>

            {/* Ordre */}
            <td className="px-6 py-4 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rubrique.ordre || 0}
              </span>
            </td>

            {/* Statut */}
            <td className="px-6 py-4 text-center">
              {rubrique.visible ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold">
                  <Eye size={12} /> Visible
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold">
                  <EyeOff size={12} /> Masquée
                </span>
              )}
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleVisibility(rubrique.id, rubrique.visible !== false)}
                  disabled={isActionLoading}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                  title={rubrique.visible ? 'Masquer' : 'Afficher'}
                >
                  {isActionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : rubrique.visible ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

                <button
                  onClick={() => openEditModal(rubrique)}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                  title="Modifier"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => handleDelete(rubrique.id)}
                  disabled={isActionLoading}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
                  title="Supprimer"
                >
                  {isActionLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </td>
          </tr>

          {hasChildren && isExpanded && renderRubriqueTree(rubrique.enfants!, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#3E7B52] to-[#2e623f] dark:from-[#13EC13] dark:to-[#0dbd0d] rounded-xl">
              <FolderTree className="text-white dark:text-black h-6 w-6"/>
            </div>
            Gestion des Rubriques
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">
            Organisez la structure de navigation et les catégories du site.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={loadRubriques}
            disabled={loading}
            className="p-3 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400"
            title="Actualiser"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <Button
            onClick={openCreateModal}
            className="bg-[#3E7B52] hover:bg-[#326342] dark:bg-[#13EC13] dark:hover:bg-[#0dbd0d] text-white dark:text-black font-bold h-12 px-6"
          >
            <Plus size={18} className="mr-2" />
            Nouvelle Rubrique
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher une rubrique..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-[#3E7B52]/20 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle size={18} />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#3E7B52] dark:text-[#13EC13]" size={40}/>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Chargement...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-zinc-950/30 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                  Slug
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Ordre
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRubriques.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <FolderOpen size={48} className="text-gray-400" />
                      <p className="text-sm font-semibold text-gray-600 dark:text-zinc-400">
                        {searchTerm ? 'Aucune rubrique trouvée' : 'Aucune rubrique créée'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                renderRubriqueTree(filteredRubriques)
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border dark:border-zinc-800 overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-gradient-to-r from-[#3E7B52] to-[#2e623f] dark:from-[#13EC13] dark:to-[#0dbd0d]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {editingId ? <Edit className="text-white" size={24}/> : <Plus className="text-white" size={24}/>}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {editingId ? 'Modifier la rubrique' : 'Nouvelle rubrique'}
                    </h3>
                    <p className="text-white/80 text-xs">
                      {editingId ? 'Modifiez les informations de la rubrique' : 'Créez une nouvelle rubrique de navigation'}
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
                  <X size={20}/>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              {/* Nom */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Nom de la rubrique *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleNomChange(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#3E7B52]/20"
                  placeholder="Ex: Politique Internationale"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-24 px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#3E7B52]/20 resize-none"
                  placeholder="Description optionnelle..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#3E7B52]/20"
                    placeholder="politique-internationale"
                  />
                </div>

                {/* Parent */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Rubrique Parente
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value ? parseInt(e.target.value) : null }))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#3E7B52]/20"
                  >
                    <option value="">Aucune (Racine)</option>
                    {rubriques
                      .filter(r => r.id !== editingId)
                      .map(r => (
                        <option key={r.id} value={r.id}>
                          {r.nom}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Icône */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Icône (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icone}
                    onChange={(e) => setFormData(prev => ({ ...prev, icone: e.target.value }))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#3E7B52]/20 text-2xl text-center"
                    maxLength={2}
                  />
                </div>

                {/* Couleur */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Couleur
                  </label>
                  <input
                    type="color"
                    value={formData.couleur}
                    onChange={(e) => setFormData(prev => ({ ...prev, couleur: e.target.value }))}
                    className="w-full h-12 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black outline-none cursor-pointer"
                  />
                </div>

                {/* Ordre */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={formData.ordre}
                    onChange={(e) => setFormData(prev => ({ ...prev, ordre: parseInt(e.target.value) || 0 }))}
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#3E7B52]/20"
                    min="0"
                  />
                </div>
              </div>

              {/* Visible */}
              <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700 has-[:checked]:border-[#3E7B52] dark:has-[:checked]:border-[#13EC13] has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/10">
                <input
                  type="checkbox"
                  checked={formData.visible}
                  onChange={(e) => setFormData(prev => ({ ...prev, visible: e.target.checked }))}
                  className="w-5 h-5 text-[#3E7B52] dark:text-[#13EC13] rounded focus:ring-2 focus:ring-[#3E7B52]/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye size={16} className="text-[#3E7B52] dark:text-[#13EC13]"/>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">Rubrique visible</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Afficher cette rubrique dans les menus de navigation publics
                  </p>
                </div>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-11 rounded-lg border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-[2] h-11 rounded-lg bg-[#3E7B52] hover:bg-[#326342] dark:bg-[#13EC13] dark:hover:bg-[#0dbd0d] text-white dark:text-black font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {editingId ? 'Enregistrer' : 'Créer la rubrique'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}