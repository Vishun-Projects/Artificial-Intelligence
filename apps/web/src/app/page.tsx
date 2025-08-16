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

type Risk = { id: string; title: string; likelihood: number; impact: number; rating: number; status: string }

type Incident = { id: string; title: string; severity: number; status: string }

export default function ShowcasePage() {
	const [tenant, setTenant] = useState<Tenant | null>(null)
	const [docs, setDocs] = useState<Document[]>([])
	const [risks, setRisks] = useState<Risk[]>([])
	const [incidents, setIncidents] = useState<Incident[]>([])
	const [summary, setSummary] = useState<Summary | null>(null)
	const [title, setTitle] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [riskTitle, setRiskTitle] = useState("")
	const [likelihood, setLikelihood] = useState(3)
	const [impact, setImpact] = useState(3)
	const [incidentTitle, setIncidentTitle] = useState("")
	const [severity, setSeverity] = useState(2)
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
		const [list, s, r, i] = await Promise.all([
			axios.get(`${API_BASE}/documents`, { params: { tenantId } }).then(r => r.data),
			axios.get(`${API_BASE}/dashboard/summary`, { params: { tenantId } }).then(r => r.data),
			axios.get(`${API_BASE}/risks`, { params: { tenantId } }).then(r => r.data),
			axios.get(`${API_BASE}/incidents`, { params: { tenantId } }).then(r => r.data),
		])
		setDocs(list)
		setSummary(s)
		setRisks(r)
		setIncidents(i)
	}

	async function uploadToS3(tenantId: string, f: File): Promise<{ bucket: string; key: string; url: string }> {
		const key = `${tenantId}/documents/${crypto.randomUUID()}-${encodeURIComponent(f.name)}`
		const { data } = await axios.get(`${API_BASE}/storage/presign`, { params: { key, contentType: f.type } })
		await axios.put(data.url, f, { headers: { "Content-Type": f.type } })
		return data
	}

	async function createDoc() {
		if (!tenant || !title.trim() || !token) return
		let contentUrl = "s3://placeholder"
		if (file) {
			const { bucket, key } = await uploadToS3(tenant.id, file)
			contentUrl = `s3://${bucket}/${key}`
		}
		await axios.post(`${API_BASE}/documents`, { tenantId: tenant.id, title, contentUrl })
		await loadData(tenant.id)
		setTitle("")
		setFile(null)
	}

	async function createRisk() {
		if (!tenant || !riskTitle.trim() || !token) return
		await axios.post(`${API_BASE}/risks`, { tenantId: tenant.id, title: riskTitle, likelihood, impact })
		await loadData(tenant.id)
		setRiskTitle("")
	}

	async function createIncident() {
		if (!tenant || !incidentTitle.trim() || !token) return
		await axios.post(`${API_BASE}/incidents`, { tenantId: tenant.id, title: incidentTitle, severity })
		await loadData(tenant.id)
		setIncidentTitle("")
	}

	return (
		<main className="mx-auto max-w-5xl p-6">
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

			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<h2 className="text-xl font-medium">Documents</h2>
					<div className="mt-3 flex gap-2">
						<input className="border rounded px-3 py-2 flex-1" placeholder="New document title" value={title} onChange={e => setTitle(e.target.value)} />
						<input className="border rounded px-3 py-2" type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
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

				<div>
					<h2 className="text-xl font-medium">Risks</h2>
					<div className="mt-3 flex gap-2 items-center">
						<input className="border rounded px-3 py-2 flex-1" placeholder="Risk title" value={riskTitle} onChange={e => setRiskTitle(e.target.value)} />
						<label className="text-sm text-gray-600">L:</label>
						<input className="border rounded px-2 py-1 w-16" type="number" min={1} max={5} value={likelihood} onChange={e => setLikelihood(parseInt(e.target.value || '1'))} />
						<label className="text-sm text-gray-600">I:</label>
						<input className="border rounded px-2 py-1 w-16" type="number" min={1} max={5} value={impact} onChange={e => setImpact(parseInt(e.target.value || '1'))} />
						<button className="bg-blue-600 text-white rounded px-4" onClick={createRisk} disabled={!token}>Add</button>
					</div>
					<ul className="mt-4 divide-y border rounded">
						{risks.map(r => (
							<li key={r.id} className="p-3 flex items-center justify-between">
								<span>{r.title} <span className="text-gray-500 text-sm">(L{r.likelihood} x I{r.impact} = {r.rating})</span></span>
								<span className="text-sm text-gray-500">{r.status}</span>
							</li>
						))}
						{risks.length === 0 && <li className="p-3 text-gray-500">No risks</li>}
					</ul>
				</div>

				<div>
					<h2 className="text-xl font-medium">Incidents</h2>
					<div className="mt-3 flex gap-2 items-center">
						<input className="border rounded px-3 py-2 flex-1" placeholder="Incident title" value={incidentTitle} onChange={e => setIncidentTitle(e.target.value)} />
						<label className="text-sm text-gray-600">Severity:</label>
						<input className="border rounded px-2 py-1 w-16" type="number" min={1} max={5} value={severity} onChange={e => setSeverity(parseInt(e.target.value || '1'))} />
						<button className="bg-blue-600 text-white rounded px-4" onClick={createIncident} disabled={!token}>Add</button>
					</div>
					<ul className="mt-4 divide-y border rounded">
						{incidents.map(it => (
							<li key={it.id} className="p-3 flex items-center justify-between">
								<span>{it.title}</span>
								<span className="text-sm text-gray-500">sev {it.severity} · {it.status}</span>
							</li>
						))}
						{incidents.length === 0 && <li className="p-3 text-gray-500">No incidents</li>}
					</ul>
				</div>
			</div>
		</main>
	)
}
