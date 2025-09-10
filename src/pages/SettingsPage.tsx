import { useState } from 'react';
import { Loader2, AlertCircle, Edit, Trash2, Save, X, Plus, Store } from 'lucide-react';
import { useShopManagement, useShopForm, useShopValidation } from '../hooks/useShops';
import type { CreateShopData, UpdateShopData } from '../types/shop';

export function SettingsPage() {
    // Shop management hooks
    const shopManagement = useShopManagement();
    const shopForm = useShopForm();
    const validation = useShopValidation();

    // Local state for form handling
    const [newShopData, setNewShopData] = useState<CreateShopData>({
        name: '',
        abbr_3: ''
    });
    const [editingShopId, setEditingShopId] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<UpdateShopData>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Handle add shop
    const handleAddShop = async () => {
        const { errors, isValid } = validation.validateShopData(newShopData);
        setFormErrors(errors);

        if (!isValid) return;

        try {
            await shopForm.createShop(newShopData);
            setNewShopData({ name: '', abbr_3: '' });
            setFormErrors({});
        } catch (error) {
            console.error('Failed to create shop:', error);
        }
    };

    // Handle edit shop
    const handleEditStart = (shopId: number) => {
        const shop = shopManagement.shops.find(s => s.id === shopId);
        if (shop) {
            setEditingShopId(shopId);
            setEditingData({
                name: shop.name,
                abbr_3: shop.abbr_3
            });
            setFormErrors({});
        }
    };

    const handleEditCancel = () => {
        setEditingShopId(null);
        setEditingData({});
        setFormErrors({});
    };

    const handleEditSave = async () => {
        if (!editingShopId) return;

        const { errors, isValid } = validation.validateShopData(editingData, editingShopId);
        setFormErrors(errors);

        if (!isValid) return;

        try {
            await shopManagement.updateShop(editingShopId, editingData);
            handleEditCancel();
        } catch (error) {
            console.error('Failed to update shop:', error);
        }
    };

    // Handle delete shop
    const handleDeleteShop = async (shopId: number, shopName: string) => {
        if (window.confirm(`Are you sure you want to delete "${shopName}"? This action cannot be undone.`)) {
            try {
                await shopManagement.deleteShop(shopId, shopName);
            } catch (error) {
                console.error('Failed to delete shop:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-slate-400">Manage your application preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">General Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Company Name
                            </label>
                            <input
                                type="text"
                                defaultValue="SalesFlow Inc."
                                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Default Currency
                            </label>
                            <select className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                                <option value="USD">USD - US Dollar</option>
                                <option value="VND">VND - Vietnamese Dong</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Default Exchange Rate (USD to VND)
                            </label>
                            <input
                                type="number"
                                defaultValue="24500"
                                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Notifications</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Email Notifications</p>
                                <p className="text-slate-400 text-sm">Receive email alerts for new orders</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-medium">Push Notifications</p>
                                <p className="text-slate-400 text-sm">Browser notifications for updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Export Settings */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Export & Backup</h3>
                    <div className="space-y-4">
                        <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Export All Sales Data
                        </button>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Backup Database
                        </button>
                        <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            Import Sales Data
                        </button>
                    </div>
                </div>

                {/* Manage Shops */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Store className="w-5 h-5 text-purple-400" />
                        <h3 className="text-white text-lg font-semibold">Manage Shops</h3>
                    </div>

                    {/* Error Display */}
                    {(shopManagement.hasError || shopForm.hasError) && (
                        <div className="flex items-center p-3 mb-4 text-sm text-red-400 rounded-lg bg-slate-900" role="alert">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {shopManagement.error?.message || shopForm.error?.message}
                        </div>
                    )}

                    {/* Add New Shop Form */}
                    <div className="space-y-4 mb-6 p-4 bg-slate-700 rounded-lg">
                        <h4 className="text-white font-medium">Add New Shop</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    value={newShopData.name}
                                    onChange={(e) => setNewShopData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter shop name"
                                    className={`w-full bg-slate-600 text-white rounded-lg px-3 py-2 border focus:ring-1 focus:ring-purple-500 ${
                                        formErrors.name ? 'border-red-500' : 'border-slate-500 focus:border-purple-500'
                                    }`}
                                    disabled={shopForm.isSubmitting}
                                />
                                {formErrors.name && (
                                    <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Abbreviation (3 chars) *
                                </label>
                                <input
                                    type="text"
                                    value={newShopData.abbr_3}
                                    onChange={(e) => setNewShopData(prev => ({
                                        ...prev,
                                        abbr_3: e.target.value.toUpperCase().slice(0, 3)
                                    }))}
                                    placeholder="ABC"
                                    maxLength={3}
                                    className={`w-full bg-slate-600 text-white rounded-lg px-3 py-2 border focus:ring-1 focus:ring-purple-500 ${
                                        formErrors.abbr_3 ? 'border-red-500' : 'border-slate-500 focus:border-purple-500'
                                    }`}
                                    disabled={shopForm.isSubmitting}
                                />
                                {formErrors.abbr_3 && (
                                    <p className="text-red-400 text-xs mt-1">{formErrors.abbr_3}</p>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleAddShop}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={shopForm.isSubmitting || !newShopData.name.trim() || !newShopData.abbr_3.trim()}
                        >
                            {shopForm.isSubmitting ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Add Shop
                                </>
                            )}
                        </button>
                    </div>

                    {/* Shops List */}
                    <div className="space-y-3">
                        <h4 className="text-white font-medium">Existing Shops ({shopManagement.shops.length})</h4>

                        {shopManagement.isLoading ? (
                            <div className="flex justify-center items-center h-24">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                            </div>
                        ) : shopManagement.isEmpty ? (
                            <div className="text-center py-8 text-slate-400">
                                <Store className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No shops found. Add one to get started!</p>
                            </div>
                        ) : (
                            shopManagement.shops.map(shop => (
                                <div key={shop.id} className="flex items-center justify-between bg-slate-700 p-4 rounded-lg">
                                    {editingShopId === shop.id ? (
                                        <>
                                            <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 mr-4">
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editingData.name || ''}
                                                        onChange={(e) => setEditingData(prev => ({ ...prev, name: e.target.value }))}
                                                        className={`w-full bg-slate-600 text-white rounded-lg px-3 py-2 border focus:ring-1 focus:ring-purple-500 ${
                                                            formErrors.name ? 'border-red-500' : 'border-slate-500 focus:border-purple-500'
                                                        }`}
                                                        placeholder="Shop name"
                                                    />
                                                    {formErrors.name && (
                                                        <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={editingData.abbr_3 || ''}
                                                        onChange={(e) => setEditingData(prev => ({
                                                            ...prev,
                                                            abbr_3: e.target.value.toUpperCase().slice(0, 3)
                                                        }))}
                                                        className={`w-full bg-slate-600 text-white rounded-lg px-3 py-2 border focus:ring-1 focus:ring-purple-500 ${
                                                            formErrors.abbr_3 ? 'border-red-500' : 'border-slate-500 focus:border-purple-500'
                                                        }`}
                                                        placeholder="ABC"
                                                        maxLength={3}
                                                    />
                                                    {formErrors.abbr_3 && (
                                                        <p className="text-red-400 text-xs mt-1">{formErrors.abbr_3}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handleEditSave}
                                                    disabled={shopManagement.isUpdating}
                                                    className="p-2 text-green-400 hover:text-green-300 disabled:text-slate-500"
                                                    title="Save changes"
                                                >
                                                    {shopManagement.isUpdating ? (
                                                        <Loader2 className="animate-spin h-5 w-5" />
                                                    ) : (
                                                        <Save size={20} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="p-2 text-slate-400 hover:text-slate-200"
                                                    title="Cancel editing"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white font-medium">{shop.name}</span>
                                                    <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
                                                        {shop.abbr_3}
                                                    </span>
                                                </div>
                                                {shop.created_at && (
                                                    <p className="text-slate-400 text-sm mt-1">
                                                        Created: {new Date(shop.created_at).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditStart(shop.id)}
                                                    className="p-2 text-slate-400 hover:text-purple-400 transition-colors"
                                                    title="Edit shop"
                                                    disabled={shopManagement.isUpdating || shopManagement.isDeleting}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteShop(shop.id, shop.name)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete shop"
                                                    disabled={shopManagement.isUpdating || shopManagement.isDeleting}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Shop Stats */}
                    {shopManagement.stats && (
                        <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                            <h4 className="text-white font-medium mb-3">Statistics</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-400">Total Shops:</span>
                                    <span className="text-white ml-2 font-medium">{shopManagement.stats.totalShops}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Total Products:</span>
                                    <span className="text-white ml-2 font-medium">{shopManagement.stats.totalProducts}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}