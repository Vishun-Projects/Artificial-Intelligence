"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = "/api"

function setAuth(token: string) {
	axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

type Tenant = { id: string; name: string; slug: string }

type Document = { id: string; title: string; status: string }

type Summary = { riskCount: number; incidentOpen: number; docsCount: number }

export default function ShowcasePage() {
	const [tenant, setTenant] = useState<Tenant | null>(null)
	const [docs, setDocs] = useState<Document[]>([])
	const [summary, setSummary] = useState<Summary | null>(null)
	const [title, setTitle] = useState("")
	const [email, setEmail] = useState("admin@acme.com")
	const [password, setPassword] = useState("ChangeMe123!")
	const [token, setToken] = useState<string | null>(null)
	const slug = "acme"

	async function login() {
		const t = await axios.get(`${API_BASE}/tenants/by-slug`, { params: { slug } }).then(r => r.data)
		setTenant(t)
		const auth = await axios.post(`${API_BASE}/auth/login`, { tenantId: t.id, email, password }).then(r => r.data)
		setToken(auth.accessToken)
		setAuth(auth.accessToken)
		await loadData(t.id)
	}

	async function loadData(tenantId: string) {
		const list = await axios.get(`${API_BASE}/documents`, { params: { tenantId } }).then(r => r.data)
		setDocs(list)
		const s = await axios.get(`${API_BASE}/dashboard/summary`, { params: { tenantId } }).then(r => r.data)
		setSummary(s)
	}

	async function createDoc() {
		if (!tenant || !title.trim() || !token) return
		await axios.post(`${API_BASE}/documents`, { tenantId: tenant.id, title, contentUrl: "s3://placeholder" })
		await loadData(tenant.id)
		setTitle("")
	}

	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="text-2xl font-semibold">GRC Platform Showcase</h1>
			<div className="mt-4 border rounded p-3">
				<div className="font-medium mb-2">Login</div>
				<div className="flex gap-2">
					<input className="border rounded px-3 py-2 flex-1" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
					<input className="border rounded px-3 py-2 flex-1" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					<button className="bg-green-600 text-white rounded px-4" onClick={login}>Sign in</button>
				</div>
			</div>

			{tenant && <p className="text-gray-600 mt-3">Tenant: {tenant.name} ({tenant.slug})</p>}

			{summary && (
				<div className="mt-6 grid grid-cols-3 gap-3">
					<div className="border rounded p-3"><div className="text-sm text-gray-500">Risks</div><div className="text-xl font-semibold">{summary.riskCount}</div></div>
					<div className="border rounded p-3"><div className="text-sm text-gray-500">Open Incidents</div><div className="text-xl font-semibold">{summary.incidentOpen}</div></div>
					<div className="border rounded p-3"><div className="text-sm text-gray-500">Documents</div><div className="text-xl font-semibold">{summary.docsCount}</div></div>
				</div>
			)}

			<div className="mt-8">
				<h2 className="text-xl font-medium">Documents</h2>
				<div className="mt-3 flex gap-2">
					<input className="border rounded px-3 py-2 flex-1" placeholder="New document title" value={title} onChange={e => setTitle(e.target.value)} />
					<button className="bg-blue-600 text-white rounded px-4" onClick={createDoc} disabled={!token}>Create</button>
				</div>
				<ul className="mt-4 divide-y border rounded">
					{docs.map(d => (
						<li key={d.id} className="p-3 flex items-center justify-between">
							<span>{d.title}</span>
							<span className="text-sm text-gray-500">{d.status}</span>
						</li>
					))}
					{docs.length === 0 && <li className="p-3 text-gray-500">No documents yet</li>}
				</ul>
			</div>
		</main>
	)
}
