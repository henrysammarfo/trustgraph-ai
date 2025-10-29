"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function AddAgentDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    type: "trading",
    chainId: "1",
  })
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setOpen(false)
        setFormData({ name: "", address: "", type: "trading", chainId: "1" })
        router.refresh()

        // Start monitoring the agent
        await fetch("/api/monitor/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agentId: data.id }),
        })
      } else {
        const error = await response.json()
        alert(error.error || "Failed to add agent")
      }
    } catch (error) {
      console.error("[v0] Failed to add agent:", error)
      alert("Failed to add agent")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900/95 border-slate-800/50 backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Add New Agent</DialogTitle>
          <DialogDescription className="text-slate-400">
            Register a new AI agent to start monitoring its blockchain activity
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Agent Name
            </Label>
            <Input
              id="name"
              placeholder="My Trading Agent"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-slate-300">
              Wallet Address
            </Label>
            <Input
              id="address"
              placeholder="0x..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              pattern="^0x[a-fA-F0-9]{40}$"
              className="bg-slate-800 border-slate-700 text-white font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-slate-300">
              Agent Type
            </Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="trading">Trading Agent</SelectItem>
                <SelectItem value="defi">DeFi Agent</SelectItem>
                <SelectItem value="nft">NFT Agent</SelectItem>
                <SelectItem value="governance">Governance Agent</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chainId" className="text-slate-300">
              Blockchain Network
            </Label>
            <Select value={formData.chainId} onValueChange={(value) => setFormData({ ...formData, chainId: value })}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="1">Ethereum Mainnet</SelectItem>
                <SelectItem value="137">Polygon</SelectItem>
                <SelectItem value="56">BSC</SelectItem>
                <SelectItem value="42161">Arbitrum</SelectItem>
                <SelectItem value="10">Optimism</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Agent"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
