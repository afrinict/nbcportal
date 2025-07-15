import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Unit {
  id: number;
  name: string;
  code: string;
  description?: string;
  departmentId: number;
  isActive: boolean;
  headOfUnit?: number;
  createdAt: string;
  updatedAt: string;
}

export default function UnitsAdminPage() {
  const { user } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    code: '', 
    description: '', 
    departmentId: '' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/units', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch units');
      }
      
      const data = await response.json();
      setUnits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch departments');
      }
      
      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUnits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.departmentId) return;

    try {
      const url = editingId ? `/api/units/${editingId}` : '/api/units';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...form,
          departmentId: parseInt(form.departmentId)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save unit');
      }

      setForm({ name: '', code: '', description: '', departmentId: '' });
      setEditingId(null);
      fetchUnits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (unit: Unit) => {
    setForm({
      name: unit.name,
      code: unit.code,
      description: unit.description || '',
      departmentId: unit.departmentId.toString()
    });
    setEditingId(unit.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;

    try {
      const response = await fetch(`/api/units/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete unit');
      }

      fetchUnits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancel = () => {
    setForm({ name: '', code: '', description: '', departmentId: '' });
    setEditingId(null);
  };

  const getDepartmentName = (departmentId: number) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept ? dept.name : 'Unknown';
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto py-8">Loading units...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Units</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Unit' : 'Add New Unit'}
        </h2>
        <div className="mb-2">
          <label className="block text-sm font-medium">Name</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="border rounded px-2 py-1 w-full" 
            required 
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Code</label>
          <input 
            name="code" 
            value={form.code} 
            onChange={handleChange} 
            className="border rounded px-2 py-1 w-full" 
            required 
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Department</label>
          <select 
            name="departmentId" 
            value={form.departmentId} 
            onChange={handleChange} 
            className="border rounded px-2 py-1 w-full" 
            required
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            className="border rounded px-2 py-1 w-full" 
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-nbc-blue text-white px-4 py-2 rounded">
            {editingId ? 'Update Unit' : 'Add Unit'}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id} className="border-t">
              <td className="p-2">{unit.name}</td>
              <td className="p-2">{unit.code}</td>
              <td className="p-2">{getDepartmentName(unit.departmentId)}</td>
              <td className="p-2">{unit.description}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  unit.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {unit.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-2">
                <button 
                  onClick={() => handleEdit(unit)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(unit.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 