import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AcademicMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([
    { id: 1, title: 'Mathematics Curriculum Guide', type: 'PDF', date: '2024-01-15', distributed: true },
    { id: 2, title: 'Science Lab Manual', type: 'DOC', date: '2024-01-10', distributed: false },
    { id: 3, title: 'English Literature Syllabus', type: 'PDF', date: '2024-01-08', distributed: true }
  ]);

  const distributeMaterial = (materialId) => {
    setMaterials(materials.map(m => 
      m.id === materialId ? { ...m, distributed: true } : m
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Academic Materials Distribution</h2>
        <p className="text-gray-600">Manage teaching materials for staff</p>
      </div>
      
      <div className="divide-y">
        {materials.map(material => (
          <div key={material.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{material.title}</h3>
              <p className="text-sm text-gray-600">
                {material.type} • {material.date} • 
                <span className={material.distributed ? 'text-green-600' : 'text-yellow-600'}>
                  {material.distributed ? ' Distributed' : ' Pending Distribution'}
                </span>
              </p>
            </div>
            {!material.distributed && user.role === 'VP Academic' && (
              <button
                onClick={() => distributeMaterial(material.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Distribute
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
