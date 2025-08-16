"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE = "/api"

type Tenant = { id: string; name: string; slug: string }

type Document = { id: string; title: string; status: string }

type Summary = { riskCount: number; incidentOpen: number; docsCount: number }

export default function ShowcasePage() {
	const [tenant, setTenant] = useState<Tenant | null>(null)
	const [docs, setDocs] = useState<Document[]>([])
	const [summary, setSummary] = useState<Summary | null>(null)
	const [title, setTitle] = useState("")
	const slug = "acme"

	useEffect(() => {
		async function load() {
			const t = await axios.get(`${API_BASE}/tenants/by-slug`, { params: { slug } }).then(r => r.data)
			setTenant(t)
			const list = await axios.get(`${API_BASE}/documents`, { params: { tenantId: t.id } }).then(r => r.data)
			setDocs(list)
			const s = await axios.get(`${API_BASE}/dashboard/summary`, { params: { tenantId: t.id } }).then(r => r.data)
			setSummary(s)
		}
		load().catch(console.error)
	}, [])

	async function createDoc() {
		if (!tenant || !title.trim()) return
		await axios.post(`${API_BASE}/documents`, { tenantId: tenant.id, title, contentUrl: "s3://placeholder" })
		const list = await axios.get(`${API_BASE}/documents`, { params: { tenantId: tenant.id } }).then(r => r.data)
		setDocs(list)
		const s = await axios.get(`${API_BASE}/dashboard/summary`, { params: { tenantId: tenant!.id } }).then(r => r.data)
		setSummary(s)
		setTitle("")
	}

	return (
		<main className="mx-auto max-w-3xl p-6">
			<h1 className="text-2xl font-semibold">GRC Platform Showcase</h1>
			<p className="text-gray-600 mt-1">Tenant: {tenant ? `${tenant.name} (${tenant.slug})` : "loading..."}</p>

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
					<button className="bg-blue-600 text-white rounded px-4" onClick={createDoc}>Create</button>
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
