import React, { useState } from "react";
import ExamBankActions from "./ExamBankActions";
import { useAuth } from "../../context/AuthContext";

export default function ExamBankRow({ student }) {
  const { user } = useAuth() || {};
  const [ca, setCA] = useState(student.ca || 0);
  const [exam, setExam] = useState(student.exam || 0);

  const total = ca + exam;
  const canEdit = ["Subject Teacher"].includes(user?.role);

  return (
    <tr>
      <td className="border p-2">{student.name}</td>
      <td className="border p-2">{student.subject}</td>
      <td className="border p-2">
        {canEdit ? <input type="number" value={ca} onChange={(e) => setCA(e.target.value)} className="w-16" /> : ca}
      </td>
      <td className="border p-2">
        {canEdit ? <input type="number" value={exam} onChange={(e) => setExam(e.target.value)} className="w-16" /> : exam}
      </td>
      <td className="border p-2">{total}</td>
      <td className="border p-2"><ExamBankActions canEdit={canEdit} /></td>
    </tr>
  );
}
