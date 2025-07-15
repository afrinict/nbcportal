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
  departmentId: number;
}

interface Subunit {
  id: number;
  name: string;
  code: string;
  description?: string;
  unitId: number;
  isActive: boolean;
  headOfSubunit?: number;
  createdAt: string;
  updatedAt: string;
}

export default function SubunitsAdminPage() {
  const { user } = useAuth();
  const [subunits, setSubunits] = useState<Subunit[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    code: '', 
    description: '', 
    departmentId: '',
    unitId: '' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSubunits = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subunits', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch subunits');
      setSubunits(await response.json());
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
      if (!response.ok) throw new Error('Failed to fetch departments');
      setDepartments(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch('/api/units', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch units');
      setUnits(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchUnits();
    fetchSubunits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.unitId) return;
    try {
      const url = editingId ? `/api/subunits/${editingId}` : '/api/subunits';
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: form.name,
          code: form.code,
          description: form.description,
          unitId: parseInt(form.unitId)
        })
      });
      if (!response.ok) throw new Error('Failed to save subunit');
      setForm({ name: '', code: '', description: '', departmentId: '', unitId: '' });
      setEditingId(null);
      fetchSubunits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (subunit: Subunit) => {
    const unit = units.find(u => u.id === subunit.unitId);
    setForm({
      name: subunit.name,
      code: subunit.code,
      description: subunit.description || '',
      departmentId: unit ? unit.departmentId.toString() : '',
      unitId: subunit.unitId.toString()
    });
    setEditingId(subunit.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subunit?')) return;
    try {
      const response = await fetch(`/api/subunits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete subunit');
      fetchSubunits();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCancel = () => {
    setForm({ name: '', code: '', description: '', departmentId: '', unitId: '' });
    setEditingId(null);
  };

  const getUnitName = (unitId: number) => {
    const unit = units.find(u => u.id === unitId);
    return unit ? unit.name : 'Unknown';
  };
  const getDepartmentName = (unitId: number) => {
    const unit = units.find(u => u.id === unitId);
    const dept = unit ? departments.find(d => d.id === unit.departmentId) : undefined;
    return dept ? dept.name : 'Unknown';
  };

  // Filter units by selected department
  const filteredUnits = form.departmentId ? units.filter(u => u.departmentId === parseInt(form.departmentId)) : units;

  if (loading) {
    return <div className="max-w-3xl mx-auto py-8">Loading subunits...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Subunits</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit Subunit' : 'Add New Subunit'}</h2>
        <div className="mb-2">
          <label className="block text-sm font-medium">Department</label>
          <select name="departmentId" value={form.departmentId} onChange={handleChange} className="border rounded px-2 py-1 w-full" required>
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Unit</label>
          <select name="unitId" value={form.unitId} onChange={handleChange} className="border rounded px-2 py-1 w-full" required>
            <option value="">Select Unit</option>
            {filteredUnits.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name} ({unit.code})</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Code</label>
          <input name="code" value={form.code} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-nbc-blue text-white px-4 py-2 rounded">{editingId ? 'Update Subunit' : 'Add Subunit'}</button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          )}
        </div>
      </form>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Code</th>
            <th className="p-2 text-left">Unit</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subunits.map((subunit) => (
            <tr key={subunit.id} className="border-t">
              <td className="p-2">{subunit.name}</td>
              <td className="p-2">{subunit.code}</td>
              <td className="p-2">{getUnitName(subunit.unitId)}</td>
              <td className="p-2">{getDepartmentName(subunit.unitId)}</td>
              <td className="p-2">{subunit.description}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${subunit.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{subunit.isActive ? 'Active' : 'Inactive'}</span>
              </td>
              <td className="p-2">
                <button onClick={() => handleEdit(subunit)} className="text-blue-600 hover:underline mr-2">Edit</button>
                <button onClick={() => handleDelete(subunit.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 