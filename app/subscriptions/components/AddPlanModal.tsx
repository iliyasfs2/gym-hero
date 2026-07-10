"use client";

import { addPlanAction } from "../actions/actions";

interface AddPlanModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AddPlanModal({ show, onClose }: AddPlanModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add New Plan</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <form
          action={async (formData) => {
            await addPlanAction(formData);
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Plan Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., 3-Month Premium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Price (Toman)
            </label>
            <input
              type="number"
              name="price"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="500000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              placeholder="e.g., 3 Months"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Status
            </label>
            <select
              name="status"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
