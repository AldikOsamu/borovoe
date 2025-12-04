import React, { useState } from 'react';
import { 
  Home, Calendar, CreditCard, Heart, ClipboardList, 
  Clock, MessageSquare, User, ChevronRight, MapPin,
  Check, Bell, FileText, Shield, Languages, Upload,
  Phone, Mail, Building2, Stethoscope, Activity
} from 'lucide-react';

const BorovoeSanatoriumApp = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [userType, setUserType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    iin: '',
    phone: '',
    name: ''
  });
  
  // Booking state
  const [bookingStep, setBookingStep] = useState('entry');
  const [bookingData, setBookingData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
    roomType: null,
    roomNumber: null,
    totalPrice: 0
  });
  const [myBookings, setMyBookings] = useState([]);

  // Treatment & Schedule state
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [scheduleView, setScheduleView] = useState('today');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [doctorExamComplete, setDoctorExamComplete] = useState(false);

  // Profile & Documents state
  const [profileView, setProfileView] = useState('main');
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [documents, setDocuments] = useState([
    { id: 1, type: 'id', name: 'Удостоверение личности', status: 'verified', uploadedDate: '28 ноября 2024', fileSize: '2.4 MB' },
  ]);
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: 'A (II) Rh+',
    allergies: 'Нет',
    chronicConditions: 'Гипертония II степени',
    emergencyContact: '+7 (777) 987-65-43',
    emergencyContactName: 'Бекова Асель (дочь)'
  });

  // Settings state
  const [notifications, setNotifications] = useState({
    procedures: true,
    appointments: true,
    messages: true,
    reminders: true,
    marketing: false
  });
  const [reminderTime, setReminderTime] = useState(30);
  const [language, setLanguage] = useState('ru');

  // Chat & Messages state
  const [messages, setMessages] = useState([
    { id: 1, type: 'system', text: 'Ваше бронирование подтверждено', subtext: 'Заявка №12345 обработана', time: '10:30', date: '2024-12-02' },
    { id: 2, type: 'user', text: 'Здравствуйте! Можно ли изменить время процедуры ЛФК?', time: '11:45', date: '2024-12-02', status: 'read' },
    { id: 3, type: 'admin', text: 'Добрый день! Конечно, мы можем перенести ЛФК на удобное для вас время. На какое время хотите перенести?', time: '11:47', date: '2024-12-02', adminName: 'Администратор' },
    { id: 4, type: 'user', text: 'Можно на 16:00?', time: '11:50', date: '2024-12-02', status: 'read' },
    { id: 5, type: 'admin', text: 'Отлично! Я перенес все ваши занятия ЛФК на 16:00. Изменения будут видны в расписании через несколько минут.', time: '11:52', date: '2024-12-02', adminName: 'Администратор' },
    { id: 6, type: 'system', text: 'Оплата получена', subtext: 'Депозит 252,500 ₸ обработан', time: '14:20', date: '2024-12-02' },
    { id: 7, type: 'user', text: 'Спасибо большое!', time: '11:55', date: '2024-12-02', status: 'delivered' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [showChatInfo, setShowChatInfo] = useState(false);

  // Sample user data
  const userData = {
    name: registrationData.name || 'Айгерим Бекова',
    iin: registrationData.iin || '920815401234',
    phone: registrationData.phone || '+7 (777) 123-45-67',
    arrivalDate: '15 декабря 2024',
    cycle: userType === 'osms' ? 'Цикл 2 (15-29 декабря)' : null,
    room: userType === 'osms' ? '207 (Блок 1, Стандарт)' : null,
    doctor: userType === 'osms' ? 'Д-р. Нұрлан Жұмабаев' : null,
    checkoutDate: userType === 'osms' ? '29 декабря 2024' : null
  };

  const roomPrices = {
    standard: 25000,
    comfort: 35000,
    luxury: 55000
  };

  const availableRooms = {
    standard: [201, 202, 205, 206, 208],
    comfort: [203, 204, 207, 210],
    luxury: [209, 211]
  };

  // Treatment packages (for commercial patients)
  const treatmentPackages = [
    {
      id: 1,
      name: 'Кардиореабилитация',
      duration: '14 дней',
      price: 180000,
      description: 'Комплексная программа восстановления сердечно-сосудистой системы',
      procedures: [
        { name: 'ЭКГ', count: 3 },
        { name: 'ЛФК', count: 10 },
        { name: 'Массаж', count: 8 },
        { name: 'Гидротерапия', count: 12 },
        { name: 'Кислородные коктейли', count: 14 }
      ],
      color: 'from-red-100 to-pink-100'
    },
    {
      id: 2,
      name: 'Общее оздоровление',
      duration: '7-14 дней',
      price: 120000,
      description: 'Укрепление иммунитета и общее оздоровление организма',
      procedures: [
        { name: 'ЛФК', count: 7 },
        { name: 'Массаж', count: 5 },
        { name: 'Фитотерапия', count: 10 },
        { name: 'Бассейн', count: 10 }
      ],
      color: 'from-green-100 to-teal-100'
    },
    {
      id: 3,
      name: 'Реабилитация опорно-двигательного аппарата',
      duration: '14 дней',
      price: 160000,
      description: 'Восстановление функций опорно-двигательной системы',
      procedures: [
        { name: 'ЛФК', count: 12 },
        { name: 'Массаж', count: 10 },
        { name: 'Электротерапия', count: 8 },
        { name: 'Грязелечение', count: 8 },
        { name: 'Бассейн', count: 10 }
      ],
      color: 'from-blue-100 to-cyan-100'
    }
  ];

  // Mock treatment plan with schedule
  const mockTreatmentPlan = {
    packageName: 'Кардиореабилитация',
    startDate: '15 декабря 2024',
    endDate: '29 декабря 2024',
    doctor: 'Д-р. Нұрлан Жұмабаев',
    procedures: [
      {
        id: 1,
        name: 'Гидротерапия',
        location: 'Бассейн, 1 этаж',
        schedule: 'Пн, Ср, Пт — 09:00',
        totalSessions: 12,
        completedSessions: 3,
        icon: 'Activity',
        color: 'blue',
        days: [1, 3, 5]
      },
      {
        id: 2,
        name: 'Лечебный массаж',
        location: 'Кабинет 305, 3 этаж',
        schedule: 'Вт, Чт, Сб — 11:30',
        totalSessions: 8,
        completedSessions: 2,
        icon: 'Heart',
        color: 'green',
        days: [2, 4, 6]
      },
      {
        id: 3,
        name: 'ЛФК',
        location: 'Спортзал, 2 этаж',
        schedule: 'Ежедневно — 15:00',
        totalSessions: 10,
        completedSessions: 2,
        icon: 'Activity',
        color: 'purple',
        days: [1, 2, 3, 4, 5, 6, 0]
      },
      {
        id: 4,
        name: 'ЭКГ',
        location: 'Диагностика, 1 этаж',
        schedule: '16, 23, 28 декабря — 10:00',
        totalSessions: 3,
        completedSessions: 1,
        icon: 'Activity',
        color: 'pink',
        days: []
      },
      {
        id: 5,
        name: 'Кислородные коктейли',
        location: 'Фитобар, холл',
        schedule: 'Ежедневно — 12:00',
        totalSessions: 14,
        completedSessions: 3,
        icon: 'Heart',
        color: 'cyan',
        days: [1, 2, 3, 4, 5, 6, 0]
      }
    ]
  };

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-cyan-500 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-teal-500" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Боровое Санаторий</h1>
          <p className="text-gray-600 text-sm">Медицинский оздоровительный центр</p>
        </div>

        <div className="space-y-3 mb-6">
          <button 
            onClick={() => setCurrentScreen('register-commercial')}
            className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-teal-600 transition-colors"
          >
            Коммерческое бронирование
          </button>
          
          <button 
            onClick={() => setCurrentScreen('login-osms')}
            className="w-full bg-white border-2 border-teal-500 text-teal-500 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
          >
            Вход для пациентов ОСМС
          </button>
        </div>

        <p className="text-center text-xs text-gray-500">
          Для входа отсканируйте QR-код или перейдите по ссылке
        </p>
      </div>
    </div>
  );

  // Registration for commercial users
  const RegisterCommercialScreen = () => {
    const [formData, setFormData] = useState({
      iin: '',
      phone: '',
      name: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.iin || formData.iin.length !== 12) {
        newErrors.iin = 'ИИН должен содержать 12 цифр';
      }
      
      if (!formData.phone || formData.phone.length < 10) {
        newErrors.phone = 'Введите корректный номер телефона';
      }
      
      if (!formData.name || formData.name.trim().length < 3) {
        newErrors.name = 'Введите полное имя';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
      if (validateForm()) {
        setRegistrationData(formData);
        setUserType('commercial');
        setIsAuthenticated(true);
        setCurrentScreen('home');
      }
    };

    const fillDemo = () => {
      setFormData({
        iin: '920815401234',
        phone: '+7 (777) 123-45-67',
        name: 'Айгерим Бекова'
      });
    };

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
          <button onClick={() => setCurrentScreen('welcome')} className="mb-4 text-white">← Назад</button>
          <h1 className="text-2xl font-bold">Регистрация</h1>
          <p className="text-sm opacity-90 mt-1">Коммерческое бронирование</p>
        </div>
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                ИИН <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.iin}
                onChange={(e) => setFormData({ ...formData, iin: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                placeholder="920815401234"
                maxLength="12"
                className={`w-full border-2 ${errors.iin ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500`}
              />
              {errors.iin && <p className="text-red-500 text-xs mt-1">{errors.iin}</p>}
              <p className="text-xs text-gray-500 mt-1">12-значный индивидуальный идентификационный номер</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (777) 123-45-67"
                className={`w-full border-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Полное имя <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Айгерим Бекова"
                className={`w-full border-2 ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Обратите внимание:</span> Все поля обязательны для заполнения. Ваши данные защищены и используются только для бронирования.
            </p>
          </div>

          <button 
            onClick={handleSubmit} 
            className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg mb-3 hover:bg-teal-600 transition-colors"
          >
            Зарегистрироваться
          </button>

          <button 
            onClick={fillDemo}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Заполнить тестовыми данными
          </button>
        </div>
      </div>
    );
  };

  const LoginOSMSScreen = () => {
    const [iin, setIin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
      if (!iin || iin.length !== 12) {
        setError('ИИН должен содержать 12 цифр');
        return;
      }

      setRegistrationData({ iin: iin, name: 'Айгерим Бекова', phone: '' });
      setUserType('osms');
      setTreatmentPlan(mockTreatmentPlan);
      setIsAuthenticated(true);
      setCurrentScreen('home');
    };

    const fillDemo = () => {
      setIin('920815401234');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
          <button onClick={() => setCurrentScreen('welcome')} className="mb-4 text-white">← Назад</button>
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full"><Shield size={28} /></div>
            <div>
              <h1 className="text-2xl font-bold">Вход ОСМС</h1>
              <p className="text-sm opacity-90">Пациенты с направлением БГ</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-xl mb-6">
            <div className="flex items-start gap-3">
              <Check className="text-green-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Направление одобрено</p>
                <p className="text-xs text-gray-600">Ваше лечение одобрено Бюро Госпитализации. Войдите с вашим ИИН для доступа к деталям.</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              ИИН <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={iin}
              onChange={(e) => {
                setIin(e.target.value.replace(/\D/g, '').slice(0, 12));
                setError('');
              }}
              placeholder="920815401234"
              maxLength="12"
              className={`w-full border-2 ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-1">Введите ваш 12-значный ИИН</p>
          </div>

          <button 
            onClick={handleLogin} 
            className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg mb-3 hover:bg-teal-600 transition-colors"
          >
            Войти
          </button>

          <button 
            onClick={fillDemo}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Использовать тестовый ИИН
          </button>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mt-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Не получили направление?</span> Обратитесь в ваше медицинское учреждение для оформления направления через систему ОСМС.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Navigation
  const Navigation = () => {
    if (!isAuthenticated) return null;
    
    const unreadMessagesCount = messages.filter(m => m.type === 'admin' && m.id > messages.length - 3).length;
    
    const NavButton = ({ icon: Icon, label, screen, active, badge }) => (
      <button
        onClick={() => {
          setCurrentScreen(screen);
          if (screen === 'booking') setBookingStep('entry');
          if (screen === 'profile') setProfileView('main');
        }}
        className={`relative flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
          active ? 'text-teal-500' : 'text-gray-500'
        }`}
      >
        <Icon size={20} />
        <span className="text-xs">{label}</span>
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {badge}
          </span>
        )}
      </button>
    );

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 flex justify-around">
        <NavButton icon={Home} label="Главная" screen="home" active={currentScreen === 'home'} badge={0} />
        {userType === 'commercial' && <NavButton icon={Calendar} label="Бронь" screen="booking" active={currentScreen === 'booking'} badge={0} />}
        {userType === 'osms' && <NavButton icon={Heart} label="ОСМС" screen="osms" active={currentScreen === 'osms'} badge={0} />}
        <NavButton icon={ClipboardList} label="План" screen="treatment" active={currentScreen === 'treatment'} badge={0} />
        <NavButton icon={Clock} label="Расписание" screen="schedule" active={currentScreen === 'schedule'} badge={0} />
        <NavButton icon={MessageSquare} label="Чат" screen="messages" active={currentScreen === 'messages'} badge={currentScreen !== 'messages' ? unreadMessagesCount : 0} />
        <NavButton icon={User} label="Профиль" screen="profile" active={currentScreen === 'profile'} badge={0} />
      </div>
    );
  };

  // Home Dashboard (simplified)
  const HomeScreen = () => (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm opacity-90">Добрый день,</p>
            <h1 className="text-2xl font-semibold">{userData.name}</h1>
          </div>
          <button className="bg-white bg-opacity-20 p-2 rounded-full"><Bell size={20} /></button>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            {userType === 'commercial' ? <><Calendar size={18} /><span className="text-sm font-medium">Статус бронирования</span></> : <><Shield size={18} /><span className="text-sm font-medium">ОСМС Лечение</span></>}
          </div>
          {userType === 'commercial' ? (
            myBookings.length > 0 ? (
              <>
                <p className="text-lg font-semibold">Подтверждено</p>
                <p className="text-sm mt-1 opacity-90">Прибытие: {myBookings[0].checkIn}</p>
              </>
            ) : (
              <p className="text-lg font-semibold">Нет активных бронирований</p>
            )
          ) : (
            <>
              <p className="text-lg font-semibold">{userData.cycle}</p>
              <p className="text-sm mt-1 opacity-90">Прибытие: {userData.arrivalDate}</p>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Сегодня</h2>
        {userType === 'commercial' && myBookings.length === 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <Calendar className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-600 mb-4">У вас пока нет бронирований</p>
            <button 
              onClick={() => { setCurrentScreen('booking'); setBookingStep('entry'); }}
              className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Забронировать номер
            </button>
          </div>
        )}
        
        {userType === 'commercial' && myBookings.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Мое бронирование</h3>
              <button onClick={() => { setCurrentScreen('booking'); setBookingStep('my-bookings'); }} className="text-teal-500 text-sm">Подробнее</button>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <Building2 className="text-teal-500" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Номер №{myBookings[0].roomNumber}</p>
                  <p className="text-sm text-gray-600 mt-1">{myBookings[0].checkIn} - {myBookings[0].checkOut}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Plan Quick Access */}
        {treatmentPlan && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">РАСПИСАНИЕ НА СЕГОДНЯ</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl"><Activity size={24} className="text-blue-600" /></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Гидротерапия</p>
                    <p className="text-sm text-gray-600">09:00 • Бассейн, 1 этаж</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                    Через 30 мин
                  </span>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3">
                  <div className="bg-green-50 p-3 rounded-xl"><Heart size={24} className="text-green-600" /></div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Массаж</p>
                    <p className="text-sm text-gray-600">11:30 • Кабинет 305</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">ПЛАН ЛЕЧЕНИЯ</h3>
              <div 
                onClick={() => setCurrentScreen('treatment')}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200 cursor-pointer hover:border-teal-400 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{treatmentPlan.packageName}</h4>
                  <ChevronRight className="text-teal-500" size={20} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Прогресс:</span>
                    <span className="font-semibold text-teal-600">
                      {treatmentPlan.procedures.reduce((sum, p) => sum + p.completedSessions, 0)} из {treatmentPlan.procedures.reduce((sum, p) => sum + p.totalSessions, 0)} процедур
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 h-2 rounded-full"
                      style={{ 
                        width: `${(treatmentPlan.procedures.reduce((sum, p) => sum + p.completedSessions, 0) / treatmentPlan.procedures.reduce((sum, p) => sum + p.totalSessions, 0)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Demo: Activate Treatment Plan */}
        {!treatmentPlan && userType === 'commercial' && myBookings.length > 0 && (
          <div className="mb-6">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-2">План лечения</h3>
              <p className="text-sm text-gray-600 mb-3">
                Для активации плана лечения необходимо прибыть в санаторий и пройти осмотр у врача
              </p>
              <button 
                onClick={() => {
                  setHasArrived(true);
                  setCurrentScreen('treatment');
                }}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
              >
                Симулировать заезд (Demo)
              </button>
            </div>
          </div>
        )}

        {/* Messages Preview */}
        {messages.filter(m => m.type === 'admin').length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Сообщения</h2>
              <button 
                onClick={() => setCurrentScreen('messages')} 
                className="text-teal-500 text-sm flex items-center gap-1"
              >
                Открыть чат
                <ChevronRight size={16} />
              </button>
            </div>
            <div 
              onClick={() => setCurrentScreen('messages')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:border-teal-400 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-full">
                  <MessageSquare className="text-teal-600" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Администратор</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {messages.filter(m => m.type === 'admin')[messages.filter(m => m.type === 'admin').length - 1]?.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {messages.filter(m => m.type === 'admin')[messages.filter(m => m.type === 'admin').length - 1]?.time}
                  </p>
                </div>
                {messages.filter(m => m.type === 'admin' && m.id > messages.length - 3).length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {messages.filter(m => m.type === 'admin' && m.id > messages.length - 3).length}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        {(userType === 'osms' || myBookings.length > 0) && !treatmentPlan && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3">
              <div className="bg-blue-50 p-3 rounded-xl"><Activity size={24} className="text-blue-600" /></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Гидротерапия</p>
                <p className="text-sm text-gray-600">09:00 • Бассейн, 1 этаж</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Simplified OSMS screen (view only, no admin)
  const OSMSScreen = () => (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-full"><Shield size={28} /></div>
          <div>
            <h1 className="text-2xl font-bold">ОСМС Лечение</h1>
            <p className="text-sm opacity-90">ИИН: {userData.iin}</p>
          </div>
        </div>
        
        <div className="bg-green-500 bg-opacity-90 rounded-xl p-3 flex items-center gap-2">
          <Check size={20} />
          <span className="font-medium">Утверждено БГ (Бюро Госпитализации)</span>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border-2 border-purple-200 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-purple-600" size={24} />
            <div>
              <h3 className="font-semibold text-gray-800">Цикл госпитализации</h3>
              <p className="text-sm text-gray-600">{userData.cycle}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Дата прибытия:</span>
              <span className="font-semibold text-gray-800">{userData.arrivalDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Дата выписки:</span>
              <span className="font-semibold text-gray-800">{userData.checkoutDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-teal-50 p-3 rounded-xl"><Building2 className="text-teal-600" size={24} /></div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Назначенный номер</p>
              <p className="font-semibold text-gray-800 mt-1">{userData.room}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-3 rounded-xl"><Stethoscope className="text-purple-600" size={24} /></div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Лечащий врач</p>
              <p className="font-semibold text-gray-800 mt-1">{userData.doctor}</p>
              <p className="text-xs text-gray-500 mt-1">Кардиолог, 15 лет опыта</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // BOOKING MODULE - Complete Implementation
  const BookingScreen = () => {
    const calculateNights = () => {
      if (!bookingData.checkIn || !bookingData.checkOut) return 0;
      return Math.ceil((bookingData.checkOut - bookingData.checkIn) / (1000 * 60 * 60 * 24));
    };
    const nights = calculateNights();

    // Entry Screen
    if (bookingStep === 'entry') {
      const activeBookings = myBookings.filter(b => b.status === 'confirmed');
      
      return (
        <div className="pb-20">
          <div className="bg-white p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Бронирование</h1>
            <p className="text-sm text-gray-600 mt-1">Блок 2 — Коммерческое размещение</p>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <button onClick={() => setBookingStep('calendar')} className="w-full bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
                <Calendar className="mx-auto mb-3" size={48} />
                <h3 className="text-xl font-bold mb-2">Новое бронирование</h3>
                <p className="text-sm opacity-90">Забронировать номер</p>
              </button>
              <button onClick={() => setBookingStep('my-bookings')} className="w-full bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-teal-500 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <Building2 className="text-teal-500" size={40} />
                  {activeBookings.length > 0 && <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{activeBookings.length}</span>}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Мои бронирования</h3>
                <p className="text-sm text-gray-600">Просмотр и управление</p>
              </button>
            </div>
            {activeBookings.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">АКТИВНЫЕ</h3>
                {activeBookings.slice(0, 2).map(booking => (
                  <div key={booking.id} onClick={() => setBookingStep('my-bookings')} className="bg-teal-50 rounded-xl p-4 border border-teal-200 cursor-pointer mb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">№{booking.roomNumber} — {booking.roomType}</p>
                        <p className="text-sm text-gray-600 mt-1">{booking.checkIn} - {booking.checkOut}</p>
                      </div>
                      <ChevronRight className="text-teal-500" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Calendar Screen
    if (bookingStep === 'calendar') {
      const [currentMonth, setCurrentMonth] = useState(new Date());
      const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      
      const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay() };
      };

      const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
      const unavailableDates = [5, 6, 12, 13, 20, 21];

      return (
        <div className="pb-20">
          <div className="bg-white p-4 border-b border-gray-200">
            <button onClick={() => setBookingStep('entry')} className="text-teal-600 mb-2">← Назад</button>
            <h1 className="text-2xl font-bold text-gray-800">Выберите даты</h1>
          </div>
          <div className="p-4">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 mb-4 border border-teal-200">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border-2 border-teal-500">
                  <p className="text-xs text-gray-500 mb-1">Заезд</p>
                  <p className="font-semibold text-gray-800">{bookingData.checkIn ? bookingData.checkIn.toLocaleDateString('ru-RU') : 'Выберите'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Выезд</p>
                  <p className="font-semibold text-gray-800">{bookingData.checkOut ? bookingData.checkOut.toLocaleDateString('ru-RU') : 'Выберите'}</p>
                </div>
              </div>
              {nights > 0 && <p className="text-sm text-teal-600 mt-2 text-center font-medium">{nights} ночей</p>}
            </div>

            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-gray-100 rounded-lg">←</button>
              <h3 className="font-semibold text-gray-800">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-gray-100 rounded-lg">→</button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array(startingDayOfWeek).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const available = !unavailableDates.includes(day);
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const isCheckIn = bookingData.checkIn?.getDate() === day && bookingData.checkIn?.getMonth() === currentMonth.getMonth();
                  const isCheckOut = bookingData.checkOut?.getDate() === day && bookingData.checkOut?.getMonth() === currentMonth.getMonth();
                  const isInRange = bookingData.checkIn && bookingData.checkOut && date > bookingData.checkIn && date < bookingData.checkOut;
                  
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (!available) return;
                        if (!bookingData.checkIn) {
                          setBookingData({ ...bookingData, checkIn: date, checkOut: null });
                        } else if (!bookingData.checkOut && date > bookingData.checkIn) {
                          setBookingData({ ...bookingData, checkOut: date });
                        } else {
                          setBookingData({ ...bookingData, checkIn: date, checkOut: null });
                        }
                      }}
                      disabled={!available}
                      className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                        !available ? 'bg-gray-100 text-gray-400 line-through' : 
                        isCheckIn || isCheckOut ? 'bg-teal-500 text-white' :
                        isInRange ? 'bg-teal-100 text-teal-700' : 'bg-white hover:bg-teal-50 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Количество гостей</label>
              <div className="flex items-center justify-between">
                <button onClick={() => setBookingData({ ...bookingData, guests: Math.max(1, bookingData.guests - 1) })} className="w-10 h-10 bg-gray-100 rounded-lg font-bold">-</button>
                <span className="text-2xl font-bold text-gray-800">{bookingData.guests}</span>
                <button onClick={() => setBookingData({ ...bookingData, guests: Math.min(4, bookingData.guests + 1) })} className="w-10 h-10 bg-gray-100 rounded-lg font-bold">+</button>
              </div>
            </div>

            <button onClick={() => setBookingStep('rooms')} disabled={!bookingData.checkIn || !bookingData.checkOut} className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg disabled:bg-gray-300">Выбрать номер</button>
          </div>
        </div>
      );
    }

    // Room Types Screen
    if (bookingStep === 'rooms') {
      return (
        <div className="pb-20">
          <div className="bg-white p-4 border-b border-gray-200">
            <button onClick={() => setBookingStep('calendar')} className="text-teal-600 mb-2">← Назад</button>
            <h1 className="text-2xl font-bold text-gray-800">Выберите тип номера</h1>
          </div>
          <div className="p-4">
            <div className="bg-teal-50 rounded-xl p-4 mb-4 border border-teal-200">
              <div className="flex justify-between text-sm mb-2">
                <span>Даты:</span>
                <span className="font-semibold">{bookingData.checkIn?.toLocaleDateString('ru-RU')} - {bookingData.checkOut?.toLocaleDateString('ru-RU')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Гостей:</span>
                <span className="font-semibold">{bookingData.guests}</span>
              </div>
            </div>

            {['standard', 'comfort', 'luxury'].map(type => {
              const titles = { standard: 'Стандарт', comfort: 'Комфорт', luxury: 'Люкс' };
              const features = {
                standard: ['1-2 гостя', 'Одна кровать', 'Душ', 'Wi-Fi'],
                comfort: ['2-3 гостя', 'Двуспальная', 'Ванна', 'Балкон'],
                luxury: ['2-4 гостя', 'Две комнаты', 'Джакузи', 'Вид']
              };
              const gradients = {
                standard: 'from-cyan-200 to-blue-300',
                comfort: 'from-teal-200 to-green-300',
                luxury: 'from-purple-200 to-pink-300'
              };

              return (
                <div key={type} onClick={() => { setBookingData({ ...bookingData, roomType: type }); setBookingStep('room-select'); }} className="bg-white rounded-xl shadow-sm border-2 border-gray-200 mb-3 overflow-hidden cursor-pointer hover:border-teal-500">
                  <div className={`h-32 bg-gradient-to-br ${gradients[type]}`} />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{titles[type]}</h3>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{availableRooms[type].length} доступно</span>
                    </div>
                    <p className="text-2xl font-bold text-teal-600 mb-3">{roomPrices[type].toLocaleString()} ₸<span className="text-sm text-gray-500 font-normal">/ночь</span></p>
                    <div className="space-y-1">
                      {features[type].map((f, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-600"><Check size={16} className="text-teal-500" />{f}</div>)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Room Number Selection Screen
    if (bookingStep === 'room-select') {
      const roomsList = availableRooms[bookingData.roomType] || [];
      const titles = { standard: 'Стандарт', comfort: 'Комфорт', luxury: 'Люкс' };

      return (
        <div className="pb-20">
          <div className="bg-white p-4 border-b border-gray-200">
            <button onClick={() => setBookingStep('rooms')} className="text-teal-600 mb-2">← Назад</button>
            <h1 className="text-2xl font-bold text-gray-800">Выберите номер</h1>
          </div>
          <div className="p-4">
            <div className="bg-teal-50 rounded-xl p-4 mb-4 border border-teal-200">
              <h3 className="font-semibold text-gray-800 mb-2">{titles[bookingData.roomType]}</h3>
              <p className="text-sm text-gray-600">{bookingData.checkIn?.toLocaleDateString('ru-RU')} - {bookingData.checkOut?.toLocaleDateString('ru-RU')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {roomsList.map(num => (
                <button key={num} onClick={() => { setBookingData({ ...bookingData, roomNumber: num }); setBookingStep('confirm'); }} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-teal-500 transition-colors">
                  <Building2 className="text-teal-500 mx-auto mb-2" size={32} />
                  <p className="text-2xl font-bold text-gray-800">№{num}</p>
                  <p className="text-xs text-gray-500 mt-1">2 этаж</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Confirmation Screen
    if (bookingStep === 'confirm') {
      const basePrice = roomPrices[bookingData.roomType] * nights;
      const serviceFee = 15000;
      const totalPrice = basePrice + serviceFee;
      const titles = { standard: 'Стандарт', comfort: 'Комфорт', luxury: 'Люкс' };

      return (
        <div className="pb-20">
          <div className="bg-white p-4 border-b border-gray-200">
            <button onClick={() => setBookingStep('room-select')} className="text-teal-600 mb-2">← Назад</button>
            <h1 className="text-2xl font-bold text-gray-800">Подтверждение</h1>
          </div>
          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-teal-100 p-3 rounded-xl"><Building2 className="text-teal-600" size={28} /></div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">Номер №{bookingData.roomNumber}</h3>
                  <p className="text-sm text-gray-600">{titles[bookingData.roomType]}</p>
                </div>
              </div>
              <div className="space-y-2 border-t border-gray-200 pt-3">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Заезд:</span><span className="font-semibold">{bookingData.checkIn?.toLocaleDateString('ru-RU')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Выезд:</span><span className="font-semibold">{bookingData.checkOut?.toLocaleDateString('ru-RU')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Ночей:</span><span className="font-semibold">{nights}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Гостей:</span><span className="font-semibold">{bookingData.guests}</span></div>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl p-4 mb-4 border border-teal-200">
              <h3 className="font-semibold text-gray-800 mb-3">Итоговая стоимость</h3>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm"><span>{nights} ночей × {roomPrices[bookingData.roomType].toLocaleString()} ₸</span><span className="font-semibold">{basePrice.toLocaleString()} ₸</span></div>
                <div className="flex justify-between text-sm"><span>Сервисный сбор</span><span className="font-semibold">{serviceFee.toLocaleString()} ₸</span></div>
              </div>
              <div className="border-t border-teal-300 pt-3 flex justify-between">
                <span className="font-bold text-gray-800 text-lg">Всего</span>
                <span className="font-bold text-teal-600 text-xl">{totalPrice.toLocaleString()} ₸</span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-4">
              <p className="text-sm text-gray-700"><span className="font-semibold">Депозит:</span> 50% ({(totalPrice * 0.5).toLocaleString()} ₸) в течение 24 часов</p>
            </div>

            <button onClick={() => {
              const newBooking = {
                id: myBookings.length + 1,
                checkIn: bookingData.checkIn.toLocaleDateString('ru-RU'),
                checkOut: bookingData.checkOut.toLocaleDateString('ru-RU'),
                roomType: titles[bookingData.roomType],
                roomNumber: bookingData.roomNumber,
                guests: bookingData.guests,
                status: 'confirmed',
                totalPrice: totalPrice
              };
              setMyBookings([...myBookings, newBooking]);
              setBookingStep('success');
            }} className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg mb-3">Подтвердить</button>
            <button onClick={() => setBookingStep('entry')} className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold">Отменить</button>
          </div>
        </div>
      );
    }

    // Success Screen
    if (bookingStep === 'success') {
      return (
        <div className="pb-20 p-4 min-h-screen flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl p-8 shadow-xl max-w-sm w-full text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Бронирование подтверждено!</h2>
            <p className="text-gray-600 mb-6">Детали отправлены на ваш телефон</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl mb-6 text-left">
              <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Следующий шаг:</span></p>
              <p className="text-sm text-gray-700">Внесите депозит 50% в течение 24 часов</p>
            </div>
            <div className="space-y-3">
              <button onClick={() => setBookingStep('my-bookings')} className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg">Мои бронирования</button>
              <button onClick={() => setCurrentScreen('home')} className="w-full text-teal-600 py-3 rounded-xl font-medium">На главную</button>
            </div>
          </div>
        </div>
      );
    }

    // My Bookings Screen
    if (bookingStep === 'my-bookings') {
      return (
        <div className="pb-20">
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Мои бронирования</h1>
              <button onClick={() => setBookingStep('entry')} className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium">+ Новое</button>
            </div>
          </div>
          <div className="p-4">
            {myBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="text-gray-300 mx-auto mb-4" size={64} />
                <p className="text-gray-500 mb-4">Нет бронирований</p>
                <button onClick={() => setBookingStep('entry')} className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold">Забронировать</button>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map(b => (
                  <div key={b.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">№{b.roomNumber} — {b.roomType}</h3>
                        <p className="text-sm text-gray-600 mt-1">{b.checkIn} - {b.checkOut}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {b.status === 'confirmed' ? 'Активно' : 'Отменено'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">{b.guests} гостей</span>
                      <span className="font-semibold text-teal-600">{b.totalPrice.toLocaleString()} ₸</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // TREATMENT PLAN MODULE - Complete Implementation
  const TreatmentScreen = () => {
    // If user hasn't arrived yet
    if (!hasArrived && userType === 'commercial') {
      return (
        <div className="pb-20 p-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Calendar className="text-gray-300 mx-auto mb-4" size={64} />
            <h2 className="text-xl font-bold text-gray-800 mb-2">План лечения будет доступен после заезда</h2>
            <p className="text-gray-600 mb-4">Вы сможете выбрать программу лечения при регистрации в санатории</p>
            <button 
              onClick={() => setHasArrived(true)}
              className="bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Симулировать заезд (Demo)
            </button>
          </div>
        </div>
      );
    }

    // If arrived but no doctor exam yet
    if (hasArrived && !doctorExamComplete && !treatmentPlan) {
      return <DoctorExaminationScreen />;
    }

    // If no treatment plan, show package selection (commercial only)
    if (!treatmentPlan && userType === 'commercial') {
      return <TreatmentPackageSelection />;
    }

    // Show treatment plan
    return <TreatmentPlanView />;
  };

  // Doctor Examination Screen
  const DoctorExaminationScreen = () => {
    const [step, setStep] = useState('waiting');

    const startExam = () => {
      setStep('examining');
      setTimeout(() => setStep('complete'), 2000);
    };

    const finishExam = () => {
      setDoctorExamComplete(true);
      setTreatmentPlan(mockTreatmentPlan);
    };

    return (
      <div className="pb-20">
        <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope size={32} />
            <div>
              <h1 className="text-2xl font-bold">Осмотр врача</h1>
              <p className="text-sm opacity-90">Обязательная процедура</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          {step === 'waiting' && (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4 text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="text-purple-600" size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Первичный осмотр</h2>
                <p className="text-gray-600 mb-4">Перед началом лечения необходимо пройти осмотр у врача</p>
                
                <div className="bg-purple-50 rounded-xl p-4 mb-4 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Врач:</span>
                    <span className="font-semibold text-gray-800">Д-р. Нұрлан Жұмабаев</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Специализация:</span>
                    <span className="font-semibold text-gray-800">Кардиолог</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Время:</span>
                    <span className="font-semibold text-gray-800">Сегодня, 14:00</span>
                  </div>
                </div>

                <button 
                  onClick={startExam}
                  className="w-full bg-purple-500 text-white py-4 rounded-xl font-semibold shadow-lg"
                >
                  Начать осмотр (Demo)
                </button>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Что будет на осмотре:</span> Врач проведет первичную диагностику, изучит вашу медицинскую историю и составит индивидуальный план лечения.
                </p>
              </div>
            </>
          )}

          {step === 'examining' && (
            <div className="text-center py-12">
              <div className="animate-pulse bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="text-purple-600" size={48} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Осмотр проводится...</h2>
              <p className="text-gray-600">Пожалуйста, подождите</p>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-600" size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Осмотр завершен</h2>
              <p className="text-gray-600 mb-6">Врач составил ваш план лечения</p>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4 text-left">
                <h3 className="font-semibold text-gray-800 mb-3">Заключение врача:</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Рекомендована программа кардиореабилитации. Состояние стабильное, противопоказаний к процедурам не выявлено.
                </p>
                <div className="bg-teal-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-800">Назначенная программа:</p>
                  <p className="text-lg font-bold text-teal-600">Кардиореабилитация — 14 дней</p>
                </div>
              </div>

              <button 
                onClick={finishExam}
                className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg"
              >
                Посмотреть план лечения
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Treatment Package Selection Screen
  const TreatmentPackageSelection = () => {
    const confirmPackage = () => {
      const pkg = treatmentPackages.find(p => p.id === selectedPackage);
      if (pkg) {
        setTreatmentPlan(mockTreatmentPlan);
      }
    };

    return (
      <div className="pb-20">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Программы лечения</h1>
          <p className="text-sm opacity-90">Выберите подходящую программу</p>
        </div>

        <div className="p-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Информация:</span> Врач может скорректировать программу после осмотра
            </p>
          </div>

          {treatmentPackages.map(pkg => (
            <div 
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`bg-white rounded-xl p-4 shadow-sm mb-3 cursor-pointer transition-all ${
                selectedPackage === pkg.id ? 'border-2 border-teal-500' : 'border-2 border-gray-200'
              }`}
            >
              <div className={`h-24 bg-gradient-to-br ${pkg.color} rounded-lg mb-3 flex items-center justify-center`}>
                <Heart className="text-gray-600" size={40} />
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>
                {selectedPackage === pkg.id && <Check className="text-teal-500" size={24} />}
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Длительность: <span className="font-semibold">{pkg.duration}</span></span>
                <span className="text-lg font-bold text-teal-600">{pkg.price.toLocaleString()} ₸</span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs font-semibold text-gray-600 mb-2">ВКЛЮЧЕННЫЕ ПРОЦЕДУРЫ:</p>
                <div className="space-y-1">
                  {pkg.procedures.map((proc, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{proc.name}</span>
                      <span className="text-gray-500">{proc.count} сеансов</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={confirmPackage}
            disabled={!selectedPackage}
            className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed mt-4"
          >
            Выбрать программу
          </button>
        </div>
      </div>
    );
  };

  // Treatment Plan View
  const TreatmentPlanView = () => {
    const plan = treatmentPlan || mockTreatmentPlan;

    return (
      <div className="pb-20">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
          <h1 className="text-2xl font-bold mb-2">План лечения</h1>
          <p className="text-sm opacity-90">{plan.packageName}</p>
        </div>

        <div className="p-4">
          {/* Treatment Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-teal-100 p-3 rounded-xl">
                <ClipboardList className="text-teal-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{plan.packageName}</h3>
                <p className="text-sm text-gray-600">{plan.startDate} - {plan.endDate}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Лечащий врач:</span>
                <span className="font-semibold text-gray-800">{plan.doctor}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Всего процедур:</span>
                <span className="font-semibold text-gray-800">
                  {plan.procedures.reduce((sum, p) => sum + p.totalSessions, 0)} сеансов
                </span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border border-green-200 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Activity size={20} className="text-green-600" />
              Прогресс лечения
            </h3>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Выполнено процедур</span>
                <span className="font-semibold text-gray-800">
                  {plan.procedures.reduce((sum, p) => sum + p.completedSessions, 0)} из {plan.procedures.reduce((sum, p) => sum + p.totalSessions, 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all"
                  style={{ 
                    width: `${(plan.procedures.reduce((sum, p) => sum + p.completedSessions, 0) / plan.procedures.reduce((sum, p) => sum + p.totalSessions, 0)) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Назначенные процедуры</h3>

          {/* Procedures List */}
          {plan.procedures.map(procedure => {
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200',
              green: 'bg-green-50 text-green-600 border-green-200',
              purple: 'bg-purple-50 text-purple-600 border-purple-200',
              pink: 'bg-pink-50 text-pink-600 border-pink-200',
              cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200'
            };
            const progressPercent = (procedure.completedSessions / procedure.totalSessions) * 100;

            return (
              <div key={procedure.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                <div className="flex gap-3">
                  <div className={`p-3 rounded-xl ${colorClasses[procedure.color]} border`}>
                    {procedure.icon === 'Activity' ? <Activity size={24} /> : <Heart size={24} />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{procedure.name}</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <MapPin size={14} />
                        {procedure.location}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock size={14} />
                        {procedure.schedule}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Прогресс</span>
                        <span className="font-semibold text-gray-700">
                          {procedure.completedSessions} / {procedure.totalSessions}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            procedure.color === 'blue' ? 'bg-blue-500' :
                            procedure.color === 'green' ? 'bg-green-500' :
                            procedure.color === 'purple' ? 'bg-purple-500' :
                            procedure.color === 'pink' ? 'bg-pink-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button 
            onClick={() => setCurrentScreen('schedule')}
            className="w-full bg-teal-50 text-teal-600 py-4 rounded-xl font-semibold border-2 border-teal-200 hover:bg-teal-100 transition-colors"
          >
            Посмотреть расписание
          </button>
        </div>
      </div>
    );
  };

  // SCHEDULE MODULE - Complete Implementation
  const ScheduleScreen = () => {
    return (
      <div className="pb-20">
        <div className="bg-white p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Расписание</h1>
          <p className="text-sm text-gray-600 mt-1">Вторник, 3 декабря 2024</p>
        </div>

        {/* View Toggle */}
        <div className="p-4 pb-0">
          <div className="bg-gray-100 rounded-xl p-1 flex gap-1 mb-4">
            <button 
              onClick={() => setScheduleView('today')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                scheduleView === 'today' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Сегодня
            </button>
            <button 
              onClick={() => setScheduleView('week')}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                scheduleView === 'week' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Неделя
            </button>
          </div>
        </div>

        {scheduleView === 'today' ? <TodayScheduleView /> : <WeekScheduleView />}
      </div>
    );
  };

  // Today Schedule View
  const TodayScheduleView = () => {
    const todaySchedule = [
      { time: '08:00', title: 'Завтрак', location: 'Столовая, 1 этаж', type: 'meal', icon: 'Clock', color: 'gray', current: false, completed: true },
      { time: '09:00', title: 'Гидротерапия', location: 'Бассейн, 1 этаж', type: 'procedure', icon: 'Activity', color: 'blue', current: true, completed: false },
      { time: '11:30', title: 'Массаж', location: 'Кабинет 305', type: 'procedure', icon: 'Heart', color: 'green', current: false, completed: false },
      { time: '13:00', title: 'Обед', location: 'Столовая, 1 этаж', type: 'meal', icon: 'Clock', color: 'gray', current: false, completed: false },
      { time: '15:00', title: 'ЛФК', location: 'Спортзал', type: 'procedure', icon: 'Activity', color: 'purple', current: false, completed: false },
      { time: '19:00', title: 'Ужин', location: 'Столовая, 1 этаж', type: 'meal', icon: 'Clock', color: 'gray', current: false, completed: false },
    ];

    return (
      <div className="p-4">
        <div className="relative">
          <div className="absolute left-14 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          {todaySchedule.map((item, idx) => {
            const colorClasses = {
              blue: 'bg-blue-500',
              green: 'bg-green-500',
              purple: 'bg-purple-500',
              gray: 'bg-gray-400'
            };
            const bgClasses = {
              blue: 'bg-blue-50 border-blue-500',
              green: 'bg-green-50 border-green-500',
              purple: 'bg-purple-50 border-purple-500',
              gray: 'bg-gray-50 border-gray-300'
            };

            return (
              <div key={idx} className="relative mb-6 ml-2">
                <div className={`absolute left-10 top-2 w-3 h-3 rounded-full ${colorClasses[item.color]} ${
                  item.current ? 'ring-4 ring-opacity-30 ring-blue-300' : ''
                } ${item.completed ? 'opacity-50' : ''}`} />
                
                <div className={`ml-20 ${
                  item.current ? `${bgClasses[item.color]} border-2` : 'bg-white border border-gray-200'
                } ${item.completed ? 'opacity-60' : ''} rounded-xl p-4 shadow-sm`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-gray-500">{item.time}</span>
                      <h3 className={`font-semibold text-gray-800 mt-1 ${item.completed ? 'line-through' : ''}`}>
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                        <MapPin size={14} />
                        {item.location}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      item.color === 'blue' ? 'bg-blue-100' :
                      item.color === 'green' ? 'bg-green-100' :
                      item.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {item.icon === 'Activity' ? <Activity size={20} className={`text-${item.color}-600`} /> :
                       item.icon === 'Heart' ? <Heart size={20} className={`text-${item.color}-600`} /> :
                       <Clock size={20} className="text-gray-600" />}
                    </div>
                  </div>
                  {item.current && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <span className="text-xs font-medium text-blue-600">▶ Текущая процедура</span>
                    </div>
                  )}
                  {item.completed && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                        <Check size={14} /> Выполнено
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notifications Card */}
        <div className="bg-teal-50 rounded-xl p-4 border border-teal-200 mt-6">
          <div className="flex items-start gap-3">
            <Bell className="text-teal-600 mt-1" size={20} />
            <div className="flex-1">
              <p className="font-medium text-gray-800 mb-1">Напоминания включены</p>
              <p className="text-sm text-gray-600 mb-3">Уведомление за 30 минут до каждой процедуры</p>
              <button className="text-sm text-teal-600 font-medium">Настроить →</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Week Schedule View
  const WeekScheduleView = () => {
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const [selectedDay, setSelectedDay] = useState(1);

    const weekSchedule = {
      0: [],
      1: [{ time: '09:00', name: 'Гидротерапия', color: 'blue' }, { time: '15:00', name: 'ЛФК', color: 'purple' }],
      2: [{ time: '11:30', name: 'Массаж', color: 'green' }, { time: '15:00', name: 'ЛФК', color: 'purple' }],
      3: [{ time: '09:00', name: 'Гидротерапия', color: 'blue' }, { time: '15:00', name: 'ЛФК', color: 'purple' }],
      4: [{ time: '11:30', name: 'Массаж', color: 'green' }, { time: '15:00', name: 'ЛФК', color: 'purple' }],
      5: [{ time: '09:00', name: 'Гидротерапия', color: 'blue' }, { time: '15:00', name: 'ЛФК', color: 'purple' }],
      6: [{ time: '11:30', name: 'Массаж', color: 'green' }],
    };

    return (
      <div className="p-4">
        {/* Week Day Selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {weekDays.map((day, idx) => {
            const procedureCount = weekSchedule[idx]?.length || 0;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex-shrink-0 rounded-xl p-3 min-w-[60px] text-center transition-all ${
                  selectedDay === idx 
                    ? 'bg-teal-500 text-white shadow-lg' 
                    : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                <div className="text-xs mb-1">{day}</div>
                <div className="text-xl font-bold">{idx + 2}</div>
                {procedureCount > 0 && (
                  <div className={`text-xs mt-1 ${selectedDay === idx ? 'text-white' : 'text-teal-600'}`}>
                    {procedureCount} проц.
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Schedule */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            {weekDays[selectedDay]}, {selectedDay + 2} декабря
          </h3>
          {weekSchedule[selectedDay]?.length > 0 ? (
            <div className="space-y-3">
              {weekSchedule[selectedDay].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-12 rounded-full ${
                    item.color === 'blue' ? 'bg-blue-500' :
                    item.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Нет запланированных процедур</p>
          )}
        </div>

        {/* Week Summary */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
          <h3 className="font-semibold text-gray-800 mb-3">Итого на неделю</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Всего процедур:</span>
              <span className="font-semibold text-gray-800">12 сеансов</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Гидротерапия:</span>
              <span className="font-semibold text-blue-600">3 раза</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Массаж:</span>
              <span className="font-semibold text-green-600">3 раза</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">ЛФК:</span>
              <span className="font-semibold text-purple-600">6 раз</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MESSAGES/CHAT MODULE - Complete Implementation
  const MessagesScreen = () => {
    const quickReplies = [
      { id: 1, text: 'Изменить время процедуры', icon: Clock },
      { id: 2, text: 'Вопрос о питании', icon: Activity },
      { id: 3, text: 'Нужна медицинская помощь', icon: Heart },
      { id: 4, text: 'Вопрос о счете', icon: CreditCard },
    ];

    const sendMessage = (text, attachment = null) => {
      if (!text.trim() && !attachment) return;

      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: text || '',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString().split('T')[0],
        status: 'sent',
        attachment: attachment
      };

      setMessages([...messages, newMessage]);
      setInputMessage('');
      setAttachments([]);
      setShowQuickReplies(false);

      // Simulate admin response
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const adminResponse = {
          id: messages.length + 2,
          type: 'admin',
          text: 'Спасибо за ваше сообщение! Мы обработаем ваш запрос в ближайшее время.',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString().split('T')[0],
          adminName: 'Администратор'
        };
        setMessages(prev => [...prev, adminResponse]);
      }, 2000);
    };

    const handleQuickReply = (text) => {
      sendMessage(text);
    };

    const handleImageUpload = () => {
      const imageAttachment = {
        type: 'image',
        name: 'Результаты анализов.jpg',
        size: '2.4 MB',
        url: null
      };
      setAttachments([...attachments, imageAttachment]);
    };

    const handleFileUpload = () => {
      const fileAttachment = {
        type: 'file',
        name: 'Медицинская справка.pdf',
        size: '1.8 MB',
        url: null
      };
      setAttachments([...attachments, fileAttachment]);
    };

    const removeAttachment = (index) => {
      setAttachments(attachments.filter((_, i) => i !== index));
    };

    const now = new Date();
    const hour = now.getHours();
    const isSupportAvailable = hour >= 9 && hour < 21;

    const groupedMessages = messages.reduce((groups, message) => {
      const date = message.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

    // Chat Info Modal
    if (showChatInfo) {
      return (
        <div className="pb-20">
          <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-4 shadow-lg">
            <button onClick={() => setShowChatInfo(false)} className="text-white mb-2">← Назад к чату</button>
            <h1 className="text-xl font-bold">О чате</h1>
          </div>

          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock size={20} className="text-teal-500" />
                Часы работы
              </h3>
              <p className="text-sm text-gray-600 mb-2">Служба поддержки доступна:</p>
              <p className="text-sm font-semibold text-gray-800">Ежедневно с 9:00 до 21:00</p>
              <p className="text-xs text-gray-500 mt-2">Сообщения, отправленные вне рабочих часов, будут обработаны на следующий рабочий день.</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Activity size={20} className="text-teal-500" />
                Время ответа
              </h3>
              <p className="text-sm text-gray-600">Обычно мы отвечаем в течение <span className="font-semibold">5 минут</span> в рабочее время.</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Upload size={20} className="text-teal-500" />
                Отправка файлов
              </h3>
              <p className="text-sm text-gray-600 mb-2">Вы можете прикреплять:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Фотографии (JPG, PNG)</li>
                <li>PDF документы</li>
                <li>Результаты анализов</li>
                <li>Медицинские справки</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">Максимальный размер файла: 5 МБ</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MessageSquare size={20} className="text-teal-500" />
                Статусы сообщений
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-gray-400" />
                  <span className="text-gray-600">Отправлено</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Check size={16} className="text-gray-400" />
                    <Check size={16} className="text-gray-400 -ml-2" />
                  </div>
                  <span className="text-gray-600">Доставлено</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <Check size={16} className="text-teal-500" />
                    <Check size={16} className="text-teal-500 -ml-2" />
                  </div>
                  <span className="text-gray-600">Прочитано</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Экстренная помощь:</span> В случае неотложной медицинской помощи, пожалуйста, свяжитесь с дежурным врачом напрямую по телефону на стойке регистрации.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="pb-20 flex flex-col h-screen">
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <MessageSquare size={24} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Чат с персоналом</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isSupportAvailable ? 'bg-green-300' : 'bg-gray-300'}`} />
                <p className="text-xs opacity-90">
                  {isSupportAvailable ? 'Онлайн • Обычно отвечает за 5 мин' : 'Оффлайн • Часы работы: 9:00-21:00'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowChatInfo(true)}
              className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <FileText size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Divider */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-200 rounded-full px-4 py-1">
                  <p className="text-xs text-gray-600 font-medium">
                    {date === new Date().toISOString().split('T')[0] ? 'Сегодня' : 
                     new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>

              {/* Messages */}
              {dateMessages.map((message) => (
                <div key={message.id} className="mb-4">
                  {message.type === 'system' && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-4 max-w-md mx-auto">
                      <div className="flex items-start gap-3">
                        <Bell className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{message.text}</p>
                          <p className="text-sm text-gray-600 mt-1">{message.subtext}</p>
                          <p className="text-xs text-gray-500 mt-2">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {message.type === 'user' && (
                    <div className="flex justify-end">
                      <div className="max-w-xs">
                        <div className="bg-teal-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                          {message.attachment && (
                            <div className="mb-2 bg-white bg-opacity-20 rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <FileText size={16} />
                                <div className="flex-1 text-xs">
                                  <p className="font-medium">{message.attachment.name}</p>
                                  <p className="opacity-75">{message.attachment.size}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p className="text-xs opacity-75">{message.time}</p>
                            {message.status === 'sent' && <Check size={14} className="opacity-75" />}
                            {message.status === 'delivered' && <><Check size={14} className="opacity-75" /><Check size={14} className="opacity-75 -ml-2" /></>}
                            {message.status === 'read' && <><Check size={14} className="text-white" /><Check size={14} className="text-white -ml-2" /></>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {message.type === 'admin' && (
                    <div className="flex justify-start">
                      <div className="max-w-xs">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                          <p className="text-xs font-medium text-teal-600 mb-1">{message.adminName}</p>
                          <p className="text-sm text-gray-700">{message.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Replies */}
          {showQuickReplies && messages.length < 10 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2 text-center">Быстрые ответы:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickReplies.map(reply => {
                  const Icon = reply.icon;
                  return (
                    <button
                      key={reply.id}
                      onClick={() => handleQuickReply(reply.text)}
                      className="bg-white border-2 border-teal-200 text-teal-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 transition-colors flex items-center gap-2"
                    >
                      <Icon size={16} />
                      <span className="text-xs">{reply.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="bg-white border-t border-gray-200 p-2">
            <div className="flex gap-2 overflow-x-auto">
              {attachments.map((attachment, index) => (
                <div key={index} className="relative bg-gray-100 rounded-lg p-2 flex items-center gap-2 min-w-[150px]">
                  <FileText className="text-teal-500" size={20} />
                  <div className="flex-1 text-xs">
                    <p className="font-medium text-gray-800 truncate">{attachment.name}</p>
                    <p className="text-gray-500">{attachment.size}</p>
                  </div>
                  <button 
                    onClick={() => removeAttachment(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {!isSupportAvailable && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg mb-3">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Служба поддержки недоступна.</span> Ваше сообщение будет обработано в рабочие часы (9:00-21:00).
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {/* Attachment Buttons */}
            <button 
              onClick={handleImageUpload}
              className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors"
              title="Прикрепить фото"
            >
              <Upload size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={handleFileUpload}
              className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors"
              title="Прикрепить файл"
            >
              <FileText size={20} className="text-gray-600" />
            </button>

            {/* Message Input */}
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (attachments.length > 0) {
                    sendMessage(inputMessage, attachments[0]);
                  } else {
                    sendMessage(inputMessage);
                  }
                }
              }}
              placeholder="Введите сообщение..."
              className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
            />

            {/* Send Button */}
            <button 
              onClick={() => {
                if (attachments.length > 0) {
                  sendMessage(inputMessage, attachments[0]);
                } else {
                  sendMessage(inputMessage);
                }
              }}
              disabled={!inputMessage.trim() && attachments.length === 0}
              className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <MessageSquare size={24} />
            </button>
          </div>

          {/* Character Counter */}
          {inputMessage.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 text-right">
              {inputMessage.length} / 500 символов
            </p>
          )}
        </div>
      </div>
    );
  };

  // PROFILE MODULE - Complete Implementation
  const ProfileScreen = () => {
    if (profileView === 'edit') return <EditProfileScreen />;
    if (profileView === 'documents') return <DocumentsScreen />;
    if (profileView === 'medical') return <MedicalInfoScreen />;
    if (profileView === 'settings') return <SettingsScreen />;

    // Main Profile Screen
    return (
      <div className="pb-20">
        <div className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white p-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold backdrop-blur-sm">
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-sm opacity-90">ИИН: {userData.iin}</p>
            </div>
            <button 
              onClick={() => setProfileView('edit')}
              className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-colors"
            >
              <FileText size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-sm font-medium hover:bg-opacity-30 transition-colors">
              <Languages size={20} className="mx-auto mb-1" />
              Русский
            </button>
            <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 text-sm font-medium hover:bg-opacity-30 transition-colors">
              <User size={20} className="mx-auto mb-1" />
              {userType === 'commercial' ? 'Коммерческий' : 'ОСМС'}
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
              onClick={() => setProfileView('documents')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-teal-500 transition-colors"
            >
              <FileText className="text-teal-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm">Документы</h3>
              <p className="text-xs text-gray-500 mt-1">
                {documents.filter(d => d.status === 'verified').length} из {documents.length}
              </p>
            </button>

            <button 
              onClick={() => setProfileView('medical')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-teal-500 transition-colors"
            >
              <Heart className="text-red-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm">Мед. данные</h3>
              <p className="text-xs text-gray-500 mt-1">Здоровье</p>
            </button>

            <button 
              onClick={() => setProfileView('settings')}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-teal-500 transition-colors"
            >
              <Bell className="text-purple-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm">Настройки</h3>
              <p className="text-xs text-gray-500 mt-1">Уведомления</p>
            </button>

            <button className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:border-teal-500 transition-colors">
              <Phone className="text-blue-500 mb-2" size={32} />
              <h3 className="font-semibold text-gray-800 text-sm">Поддержка</h3>
              <p className="text-xs text-gray-500 mt-1">Помощь</p>
            </button>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-3">Личная информация</h2>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
            <div className="flex items-center gap-3">
              <User className="text-teal-500" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Полное имя</p>
                <p className="font-medium text-gray-800 mt-1">{userData.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
            <div className="flex items-center gap-3">
              <FileText className="text-teal-500" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-500">ИИН</p>
                <p className="font-medium text-gray-800 mt-1">{userData.iin}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
            <div className="flex items-center gap-3">
              <Phone className="text-teal-500" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Телефон</p>
                <p className="font-medium text-gray-800 mt-1">{userData.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
            <div className="flex items-center gap-3">
              <Mail className="text-teal-500" size={20} />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800 mt-1">aigerim.bekova@mail.kz</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-6">
            <div className="flex items-center gap-3">
              <Check className="text-green-600" size={20} />
              <div className="flex-1">
                <p className="font-medium text-gray-800 flex items-center gap-2">
                  <Shield size={16} className="text-green-600" />
                  Профиль верифицирован
                </p>
                <p className="text-sm text-gray-600 mt-1">Все документы проверены</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setUserType(null);
              setCurrentScreen('welcome');
            }}
            className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            Выйти из аккаунта
          </button>
        </div>
      </div>
    );
  };

  // Edit Profile Screen
  const EditProfileScreen = () => {
    const [editData, setEditData] = useState({
      name: userData.name,
      phone: userData.phone,
      email: 'aigerim.bekova@mail.kz'
    });

    return (
      <div className="pb-20">
        <div className="bg-white p-4 border-b border-gray-200">
          <button onClick={() => setProfileView('main')} className="text-teal-600 mb-2">← Назад</button>
          <h1 className="text-2xl font-bold text-gray-800">Редактировать профиль</h1>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Полное имя</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Телефон</label>
              <input
                type="tel"
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">ИИН</label>
              <input
                type="text"
                value={userData.iin}
                disabled
                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-2">ИИН не может быть изменен</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              onClick={() => setProfileView('main')}
              className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold"
            >
              Отмена
            </button>
            <button 
              onClick={() => {
                setRegistrationData({ ...registrationData, name: editData.name, phone: editData.phone });
                setProfileView('main');
              }}
              className="flex-1 bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Documents Screen
  const DocumentsScreen = () => {
    const documentTypes = [
      { type: 'id', name: 'Удостоверение личности', required: true },
      { type: 'insurance', name: 'Страховой полис ОСМС', required: userType === 'osms' },
      { type: 'medical', name: 'Медицинская справка', required: false },
      { type: 'tests', name: 'Результаты анализов', required: false }
    ];

    const getStatusInfo = (status) => {
      const statusMap = {
        verified: { color: 'green', text: 'Проверено', icon: Check },
        pending: { color: 'yellow', text: 'На проверке', icon: Clock },
        rejected: { color: 'red', text: 'Отклонено', icon: FileText },
        none: { color: 'gray', text: 'Не загружено', icon: Upload }
      };
      return statusMap[status] || statusMap.none;
    };

    const uploadDocument = (type) => {
      setUploadingDoc(type);
      setTimeout(() => {
        setDocuments([...documents, {
          id: documents.length + 1,
          type: type,
          name: documentTypes.find(d => d.type === type).name,
          status: 'pending',
          uploadedDate: new Date().toLocaleDateString('ru-RU'),
          fileSize: '1.2 MB'
        }]);
        setUploadingDoc(null);
      }, 2000);
    };

    return (
      <div className="pb-20">
        <div className="bg-white p-4 border-b border-gray-200">
          <button onClick={() => setProfileView('main')} className="text-teal-600 mb-2">← Назад</button>
          <h1 className="text-2xl font-bold text-gray-800">Документы</h1>
        </div>

        <div className="p-4">
          {documentTypes.map(docType => {
            const uploadedDoc = documents.find(d => d.type === docType.type);
            const status = uploadedDoc ? uploadedDoc.status : 'none';
            const statusInfo = getStatusInfo(status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={docType.type} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {docType.name}
                      {docType.required && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Обязательно</span>}
                    </h3>
                    {uploadedDoc && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Загружено: {uploadedDoc.uploadedDate}</p>
                        <p>Размер: {uploadedDoc.fileSize}</p>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-700 flex items-center gap-1`}>
                    <StatusIcon size={14} />
                    {statusInfo.text}
                  </span>
                </div>

                {uploadingDoc === docType.type ? (
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-3 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      <span className="text-sm text-gray-700">Загрузка...</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                ) : !uploadedDoc ? (
                  <button 
                    onClick={() => uploadDocument(docType.type)}
                    className="w-full mt-3 bg-teal-50 text-teal-600 py-3 rounded-lg font-medium hover:bg-teal-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload size={16} />
                    Загрузить документ
                  </button>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium">Просмотр</button>
                    <button className="flex-1 bg-teal-50 text-teal-600 py-2 rounded-lg text-sm font-medium">Заменить</button>
                  </div>
                )}

                {status === 'rejected' && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg mt-3">
                    <p className="text-sm text-red-700 font-semibold">Причина отклонения:</p>
                    <p className="text-sm text-red-600 mt-1">Документ нечитаемый. Загрузите более четкое фото.</p>
                  </div>
                )}
              </div>
            );
          })}

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mt-4">
            <p className="text-sm text-gray-700 mb-2"><span className="font-semibold">Требования:</span></p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
              <li>Формат: JPG, PNG, PDF</li>
              <li>Максимальный размер: 5 МБ</li>
              <li>Документ должен быть читаемым</li>
              <li>Все углы документа должны быть видны</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Medical Info Screen
  const MedicalInfoScreen = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...medicalInfo });

    return (
      <div className="pb-20">
        <div className="bg-white p-4 border-b border-gray-200">
          <button onClick={() => setProfileView('main')} className="text-teal-600 mb-2">← Назад</button>
          <h1 className="text-2xl font-bold text-gray-800">Медицинская информация</h1>
        </div>

        <div className="p-4">
          {!isEditing ? (
            <>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-3 rounded-xl"><Heart className="text-red-600" size={24} /></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Группа крови</p>
                    <p className="font-semibold text-gray-800 mt-1">{medicalInfo.bloodType}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-yellow-100 p-3 rounded-xl"><Activity className="text-yellow-600" size={24} /></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Аллергии</p>
                    <p className="font-semibold text-gray-800 mt-1">{medicalInfo.allergies}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-3 rounded-xl"><ClipboardList className="text-purple-600" size={24} /></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Хронические заболевания</p>
                    <p className="font-semibold text-gray-800 mt-1">{medicalInfo.chronicConditions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4 border border-red-200 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3">Экстренный контакт</h3>
                <p className="text-sm text-gray-700 mb-1">{medicalInfo.emergencyContactName}</p>
                <p className="text-sm font-semibold text-gray-800">{medicalInfo.emergencyContact}</p>
              </div>

              <button 
                onClick={() => setIsEditing(true)}
                className="w-full bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg"
              >
                Редактировать
              </button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Группа крови</label>
                  <select
                    value={editData.bloodType}
                    onChange={(e) => setEditData({ ...editData, bloodType: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
                  >
                    <option>O (I) Rh+</option>
                    <option>O (I) Rh-</option>
                    <option>A (II) Rh+</option>
                    <option>A (II) Rh-</option>
                    <option>B (III) Rh+</option>
                    <option>B (III) Rh-</option>
                    <option>AB (IV) Rh+</option>
                    <option>AB (IV) Rh-</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Аллергии</label>
                  <input
                    type="text"
                    value={editData.allergies}
                    onChange={(e) => setEditData({ ...editData, allergies: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Хронические заболевания</label>
                  <textarea
                    value={editData.chronicConditions}
                    onChange={(e) => setEditData({ ...editData, chronicConditions: e.target.value })}
                    rows="3"
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Экстренный контакт (имя)</label>
                  <input
                    type="text"
                    value={editData.emergencyContactName}
                    onChange={(e) => setEditData({ ...editData, emergencyContactName: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Экстренный контакт (телефон)</label>
                  <input
                    type="tel"
                    value={editData.emergencyContact}
                    onChange={(e) => setEditData({ ...editData, emergencyContact: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => { setIsEditing(false); setEditData({ ...medicalInfo }); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => { setMedicalInfo(editData); setIsEditing(false); }}
                  className="flex-1 bg-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg"
                >
                  Сохранить
                </button>
              </div>
            </>
          )}

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl mt-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Конфиденциальность:</span> Эта информация используется медицинским персоналом для обеспечения вашей безопасности.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Settings Screen
  const SettingsScreen = () => {
    return (
      <div className="pb-20">
        <div className="bg-white p-4 border-b border-gray-200">
          <button onClick={() => setProfileView('main')} className="text-teal-600 mb-2">← Назад</button>
          <h1 className="text-2xl font-bold text-gray-800">Настройки</h1>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">УВЕДОМЛЕНИЯ</h3>

          {Object.entries({
            procedures: 'Процедуры и лечение',
            appointments: 'Приемы врача',
            messages: 'Сообщения',
            reminders: 'Напоминания',
            marketing: 'Маркетинговые рассылки'
          }).map(([key, label]) => (
            <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {key === 'procedures' && 'Напоминания о процедурах'}
                  {key === 'appointments' && 'Уведомления о встречах'}
                  {key === 'messages' && 'Новые сообщения от персонала'}
                  {key === 'reminders' && 'Общие напоминания'}
                  {key === 'marketing' && 'Акции и предложения'}
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                className={`w-14 h-8 rounded-full transition-colors ${
                  notifications[key] ? 'bg-teal-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  notifications[key] ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          ))}

          <h3 className="text-sm font-semibold text-gray-600 mb-3 mt-6">ВРЕМЯ НАПОМИНАНИЙ</h3>
          <div className="flex gap-2 mb-6">
            {[15, 30, 60].map(time => (
              <button
                key={time}
                onClick={() => setReminderTime(time)}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  reminderTime === time ? 'bg-teal-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {time} мин
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-gray-600 mb-3">ЯЗЫК</h3>
          <div className="space-y-2 mb-6">
            {[
              { code: 'ru', name: 'Русский' },
              { code: 'kk', name: 'Қазақша' },
              { code: 'en', name: 'English' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`w-full p-4 rounded-xl font-medium transition-all text-left ${
                  language === lang.code ? 'bg-teal-500 text-white shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                {lang.name}
                {language === lang.code && <Check className="float-right" size={20} />}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-gray-600 mb-3">О ПРИЛОЖЕНИИ</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Версия</span>
              <span className="text-sm font-semibold text-gray-800">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Последнее обновление</span>
              <span className="text-sm font-semibold text-gray-800">3 декабря 2024</span>
            </div>
          </div>

          <button className="w-full bg-teal-50 text-teal-600 py-3 rounded-xl font-medium mb-2">
            Политика конфиденциальности
          </button>
          <button className="w-full bg-gray-50 text-gray-700 py-3 rounded-xl font-medium">
            Условия использования
          </button>
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    if (!isAuthenticated) {
      if (currentScreen === 'register-commercial') return <RegisterCommercialScreen />;
      if (currentScreen === 'login-osms') return <LoginOSMSScreen />;
      return <WelcomeScreen />;
    }

    switch(currentScreen) {
      case 'home': return <HomeScreen />;
      case 'booking': return <BookingScreen />;
      case 'osms': return <OSMSScreen />;
      case 'treatment': return <TreatmentScreen />;
      case 'schedule': return <ScheduleScreen />;
      case 'messages': return <MessagesScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen max-w-md mx-auto relative font-sans">
      {isAuthenticated && (
        <div className="bg-gray-800 text-white p-2 text-center text-xs flex gap-2 justify-center flex-wrap">
          <button onClick={() => { 
            setUserType(userType === 'commercial' ? 'osms' : 'commercial'); 
            setCurrentScreen('home');
            if (userType === 'osms') {
              setTreatmentPlan(null);
              setHasArrived(false);
              setDoctorExamComplete(false);
            } else {
              setTreatmentPlan(mockTreatmentPlan);
            }
          }} className="bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600">
            Switch to {userType === 'commercial' ? 'OSMS' : 'Commercial'}
          </button>
          <button onClick={() => { 
            setIsAuthenticated(false); 
            setUserType(null); 
            setCurrentScreen('welcome');
            setTreatmentPlan(null);
            setMyBookings([]);
            setHasArrived(false);
            setDoctorExamComplete(false);
            setSelectedPackage(null);
            setProfileView('main');
            setInputMessage('');
            setAttachments([]);
            setShowChatInfo(false);
            setIsTyping(false);
            setShowQuickReplies(true);
          }} className="bg-red-700 px-3 py-1 rounded-full hover:bg-red-600">
            Logout
          </button>
        </div>
      )}
      <div className="min-h-screen">{renderScreen()}</div>
      <Navigation />
    </div>
  );
};

const App = BorovoeSanatoriumApp;
export default App;