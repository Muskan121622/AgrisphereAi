"""
Patch Marketplace.tsx to add Leaflet map next to the suppliers list.
"""
import re

path = 'src/pages/Marketplace.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the grid wrapper and entire supplier list block
# Find the AccordionContent that holds the supplier list
old_block = content[content.find('<AccordionContent className="pb-4 pt-2 border-t mt-2">'):]
# Locate the div with grid cols-2
start_marker = '                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">'
end_marker = '                          </div>\r\n                       </AccordionContent>'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1:
    # Try LF only
    start_marker = start_marker.replace('\r\n', '\n')
    end_marker = end_marker.replace('\r\n', '\n')
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker, start_idx)
    sep = '\n'
else:
    sep = '\r\n'

print(f"start_idx={start_idx}, end_idx={end_idx}")

if start_idx != -1 and end_idx != -1:
    new_block = f'''                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                            {{/* Scrollable list */}}
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                               {{loadingSuppliers ? (
                                 Array(2).fill(0).map((_, i) => (
                                   <div key={{i}} className="animate-pulse bg-slate-100 h-32 rounded-lg" />
                                 ))
                               ) : nearbySuppliers.length > 0 ? (
                                 nearbySuppliers.map((s) => (
                                   <div key={{s.id}} className="bg-slate-50 border border-slate-200 p-4 rounded-xl hover:border-orange-300 transition-colors relative group">
                                     <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className={{s.type === 'Government' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200'}}>
                                          {{s.type}}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-yellow-600 text-sm font-bold">
                                          <Star className="h-3 w-3 fill-current" /> {{s.rating}}
                                        </div>
                                     </div>
                                     <h4 className="font-bold text-slate-900 group-hover:text-orange-600 truncate uppercase">{{s.name}}</h4>
                                     <p className="text-xs text-slate-500 flex items-start gap-1 mt-1 mb-3">
                                       <MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {{s.address}}
                                     </p>
                                     <div className="flex gap-2">
                                       <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px]" onClick={{() => window.open(`tel:${{s.phone}}`)}}>
                                         <Phone className="h-3 w-3 mr-1" /> Call
                                       </Button>
                                       <Button size="sm" className="flex-1 h-8 text-[10px] bg-orange-600 hover:bg-orange-700 text-white" onClick={{() => window.open(`https://www.google.com/maps/search/?api=1&query=${{encodeURIComponent(s.name + ' ' + s.address)}}`, '_blank')}}>
                                         <ExternalLink className="h-3 w-3 mr-1" /> Directions
                                       </Button>
                                     </div>
                                   </div>
                                 ))
                               ) : (
                                 <div className="py-10 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                   <MapPin className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                   <p className="text-sm font-medium text-slate-600 mb-1">{{locationError || "Location access required"}}</p>
                                   <p className="text-xs text-slate-400 mb-4 px-10">We need your location to find verified stores near you.</p>
                                   <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white px-6" onClick={{handleGetLocation}}>
                                     {{loadingSuppliers ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}}
                                     Allow Location & Search
                                   </Button>
                                 </div>
                               )}}
                            </div>
                            {{/* Interactive Leaflet Map */}}
                            <div className="h-[400px]">
                               <NearbySuppliersMap
                                 suppliers={{nearbySuppliers}}
                                 userLocation={{getProfileLocation(user?.email) || undefined}}
                               />
                            </div>
                          </div>
                       </AccordionContent>'''

    end_of_block = end_idx + len(end_marker)
    new_content = content[:start_idx] + new_block + content[end_of_block:]
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Marketplace.tsx patched!")
else:
    print("Markers not found. Dumping surrounding context...")
    # Dump line 980 context
    lines = content.split('\n')
    for i, line in enumerate(lines[975:985], start=976):
        print(f"  {i}: {repr(line[:80])}")
