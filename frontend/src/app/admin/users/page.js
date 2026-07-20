"use client";

import { useEffect, useState } from "react";
import userService from "@/services/userService";
import UsersTable from "@/app/admin/userTamlets";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    const prev = [...users];
    setUsers((u) => u.map((x) => (x._id === id ? { ...x, role } : x)));
    try {
      await userService.updateUser(id, { role });
    } catch (err) {
      setUsers(prev);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const prev = [...users];
    setUsers((u) =>
      u.map((x) => (x._id === id ? { ...x, isActive: !currentStatus } : x))
    );
    try {
      await userService.updateUser(id, { isActive: !currentStatus });
    } catch (err) {
      setUsers(prev);
    }
  };

  const handleDelete = async (id) => {
    const prev = [...users];
    setUsers((u) => u.filter((x) => x._id !== id));
    try {
      await userService.deleteUser(id);
    } catch (err) {
      setUsers(prev);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <main dir="rtl" className="min-h-screen bg-[#1a1613] px-4 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-[#f2ede4]">
            إدارة المستخدمين
          </h1>
          <p className="mt-1 font-body text-sm text-[#a9a196]">
            {users.length} مستخدم
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="ابحث بالاسم أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-md border border-[#3a342c] bg-[#211c17] px-4 py-2 font-body text-sm text-[#f2ede4] outline-none placeholder:text-[#a9a196] focus:border-[#c69749]"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-[#3a342c] bg-[#211c17] px-4 py-2 font-body text-sm text-[#f2ede4] outline-none focus:border-[#c69749]"
          >
            <option value="all">كل الصلاحيات</option>
            <option value="user">مستخدم</option>
            <option value="admin">أدمن</option>
          </select>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-[#211c17]" />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="font-body text-sm text-[#c96a5a]">{error}</p>
        )}

        {!loading && !error && (
          <UsersTable
            users={filteredUsers}
            onRoleChange={handleRoleChange}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}
