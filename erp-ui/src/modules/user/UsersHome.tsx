export default function UsersHome() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Kullanıcı Yönetimi</h1>
      <p className="text-gray-600">
        Bu modülde sistem kullanıcılarını yönetebilirsiniz. Yeni kullanıcı
        oluşturabilir, mevcut kullanıcıları düzenleyebilir veya silebilirsiniz.
      </p>

      <div className="mt-6">
        <ul className="list-disc list-inside text-gray-700">
          <li>Kullanıcılar sayfasından tüm kullanıcıları görüntüleyin</li>
          <li>Yeni kullanıcı ekleyin</li>
          <li>Roller ve yetkileri düzenleyin</li>
        </ul>
      </div>
    </div>
  );
}