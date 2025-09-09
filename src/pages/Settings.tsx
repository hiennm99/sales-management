export function Settings() {
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

                {/* Account Settings */}
                <div className="bg-slate-800 rounded-xl p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">Account</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Admin Username
                            </label>
                            <input
                                type="text"
                                defaultValue="admin"
                                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Change Password
                        </button>
                        <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Save Settings
                </button>
            </div>
        </div>
    );
}