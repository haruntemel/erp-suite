export default function GeneralTab() {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex flex-col space-y-1">
        <label className="font-medium">Default Language</label>
        <select className="border p-2 rounded">
          <option value="TR">Türkçe</option>
          <option value="EN">English</option>
        </select>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-medium">Logotype</label>
        <input type="text" className="border p-2 rounded" />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-medium">Corporate Form</label>
        <input type="text" className="border p-2 rounded" />
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-medium">Country</label>
        <select className="border p-2 rounded">
          <option value="TR">Türkiye</option>
          <option value="US">ABD</option>
        </select>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="font-medium">Localization Country</label>
        <select className="border p-2 rounded">
          <option value="TR">Türkiye</option>
          <option value="US">ABD</option>
        </select>
      </div>
    </div>
  );
}