(function(){
  const userNameEl = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  const menuBtns = Array.from(document.querySelectorAll('.menu-btn'));
  const pages = Array.from(document.querySelectorAll('.page'));
  const pageTitle = document.getElementById('pageTitle');

  function showPage(key){
    pages.forEach(p=> p.classList.add('hidden'));
    const el = document.getElementById(key);
    if(el) el.classList.remove('hidden');
    pageTitle.textContent = {
      'trangChu':'Trang Chu','taiKhoan':'Quan Ly Tai Khoan','maKhoa':'Quan Ly Khoa','nganhHoc':'Quan Ly Nganh Hoc','lopHoc':'Quan Ly Lop Hoc','monHoc':'Quan Ly Mon Hoc'
    }[key] || 'Trang Chu';

    menuBtns.forEach(b=> b.classList.toggle('active', b.getAttribute('data-page')===key));
    // load list for page if route exists
    try{
      if(routes[key]){
        loadListFor(key, key + 'List');
      }
    }catch(e){/* ignore */}
  }

  menuBtns.forEach(b=> b.addEventListener('click', ()=> showPage(b.getAttribute('data-page'))));

  // quick action buttons (dashboard)
  const actionBtns = Array.from(document.querySelectorAll('.action'));
  actionBtns.forEach(btn => {
    const page = btn.getAttribute('data-page');
    if(page){
      btn.addEventListener('click', ()=> showPage(page));
    }
  });

  // Load current user
  fetch('/api/user/current', { credentials: 'include' })
    .then(r=>{
      if(!r.ok) throw new Error('noauth');
      return r.json();
    })
    .then(data=>{
      userNameEl.textContent = data.name || '';
    })
    .catch(()=>{
      // not authenticated - redirect to login page
      window.location.href = '/Login';
    });

  logoutBtn.addEventListener('click', ()=>{
    fetch('/api/user/logout', { method: 'POST', credentials: 'include' })
      .then(()=>{
        window.location.href = '/Login';
      });
  });

  // mapping of page keys to API controller endpoints
  const routes = {
    taiKhoan: '/api/TaiKhoanApi',
    maKhoa: '/api/MaKhoaApi',
    nganhHoc: '/api/NganhHocApi',
    lopHoc: '/api/LopHocApi',
    monHoc: '/api/MonHocApi',
    hocKy: '/api/HocKyApi',
    lopHocPhan: '/api/LopHocPhanApi',
    dangKyHoc: '/api/DangKyHocApi',
    ketQuaHocTap: '/api/KetQuaHocTapApi',
    phanCongGiangDay: '/api/PhanCongGiangDayApi'
  };

  // Friendly column labels per module
  const columnLabelsMap = {
    taiKhoan: {
      maTaiKhoan: 'Mã tài khoản', hoTen: 'Họ tên', vaiTro: 'Vai trò', trangThai: 'Trạng thái', email: 'Email', soDienThoai: 'Số điện thoại', ngaySinh: 'Ngày sinh'
    },
    maKhoa: {
      maKhoa: 'Mã Khoa', tenKhoa: 'Tên khoa', moTa: 'Mô tả'
    },
    nganhHoc: {
      maNganh: 'Mã ngành', tenNganh: 'Tên ngành', maKhoa: 'Mã khoa', moTa: 'Mô tả'
    },
    lopHoc: {
      maLop: 'Mã lớp', tenLop: 'Tên lớp', khoa: 'Khoa', nienKhoa: 'Niên khóa', maNganh: 'Mã ngành'
    },
    monHoc: {
      maMonHoc: 'Mã môn', tenMonHoc: 'Tên môn', soTinChi: 'Số tín chỉ', moTa: 'Mô tả'
    },
    lopHocPhan: {
      maLopHocPhan: 'Mã LHP', tenLopHocPhan: 'Tên LHP', maMonHoc: 'Mã môn', maGiangVien: 'Mã giảng viên', maHocKy: 'Mã học kỳ', soTinChi: 'Số tín chỉ', soLuongToiDa: 'Sức chứa', soLuongSinhVien: 'Số SV', trangThai: 'Trạng thái'
    },
    dangKyHoc: {
      maDangKy: 'Mã đăng ký', maSinhVien: 'Mã sinh viên', maLopHocPhan: 'Mã LHP', trangThai: 'Trạng thái'
    },
    ketQuaHocTap: {
      maKetQua: 'Mã kết quả', maTaiKhoan: 'Mã sinh viên', tenSinhVien: 'Tên sinh viên', maLopHocPhan: 'Mã LHP', tenLopHocPhan: 'Lớp học phần', diemTongKet: 'Điểm tổng kết', ketQua: 'Kết quả'
    },
    phanCongGiangDay: {
      maPhanCong: 'Mã phân công', maGiangVien: 'Mã giảng viên', maMonHoc: 'Mã môn', maLop: 'Mã lớp', maHocKy: 'Mã học kỳ'
    }
  };

  function getId(item){
    for(const k of Object.keys(item)){
      if(/^ma/i.test(k)) return item[k];
    }
    return null;
  }

  function getLabel(item){
    return item.hoTen || item.tenDangNhap || item.tenKhoa || item.tenNganh || item.tenLop || item.tenMonHoc || item.tenHocKy || item.tenLopHocPhan || JSON.stringify(item);
  }

  function loadListFor(key, containerId){
    const api = routes[key];
    if(!api) return;
    fetch(api, { credentials: 'include' })
      .then(r=> r.ok ? r.json() : [])
      .then(data=>{
        const el = document.getElementById(containerId);
        if(!el) return;
        if(!Array.isArray(data)){
          el.textContent = 'Không có dữ liệu hoặc API không hỗ trợ';
          return;
        }
        if(data.length===0){ el.textContent = 'Không có dữ liệu'; return; }
        // build table with headers derived from object keys
        const table = document.createElement('table');
        table.className = 'simple-table data-table';
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        // determine columns from first object
        let cols = Object.keys(data[0]).filter(k=> typeof data[0][k] !== 'object');
        // For taiKhoan page only show selected columns in specific order
        if(key === 'taiKhoan'){
          const desired = ['maTaiKhoan','hoTen','vaiTro','trangThai','email','soDienThoai','ngaySinh'];
          // only include columns that actually exist in the data
          cols = desired.filter(c => Object.prototype.hasOwnProperty.call(data[0], c));
        }

        // For nganhHoc hide maKhoa column (we show only user-facing fields)
        if(key === 'nganhHoc'){
          cols = cols.filter(c => c !== 'maKhoa');
        }

        // Friendly column labels for this module
        const columnLabels = columnLabelsMap[key] || {};
        const trHead = document.createElement('tr');
        cols.forEach(c=>{
          const th = document.createElement('th');
          th.textContent = (columnLabels && columnLabels[c]) ? columnLabels[c] : c;
          th.style.textAlign = 'left';
          th.style.padding = '10px';
          th.style.borderBottom = '1px solid #f1f5f9';
          trHead.appendChild(th);
        });
        const thActions = document.createElement('th'); thActions.textContent = 'Hành động'; thActions.style.padding='10px'; trHead.appendChild(thActions);
        thead.appendChild(trHead);

        data.slice(0,200).forEach(item=>{
          const id = getId(item);
          const tr = document.createElement('tr');
          cols.forEach(c=>{
            const td = document.createElement('td');
            let v = item[c];
            let display = '';

            if (v === null || typeof v === 'undefined') {
              display = '';
            } else if (typeof v === 'boolean') {
              // format booleans
              if (c === 'trangThai') display = v ? 'Hoạt động' : 'Khóa';
              else if (/gioi/i.test(c)) display = v ? 'Nam' : 'Nữ';
              else display = v ? 'Có' : 'Không';
            } else if (typeof v === 'number') {
              display = String(v);
            } else if (typeof v === 'string') {
              // handle string boolean values
              if (v === 'true' || v === 'false') {
                const bv = v === 'true';
                if (c === 'trangThai') display = bv ? 'Hoạt động' : 'Khóa';
                else if (/gioi/i.test(c)) display = bv ? 'Nam' : 'Nữ';
                else display = bv ? 'Có' : 'Không';
              } else {
                // detect ISO date-like strings and format dd/MM/yyyy
                const isoDate = /^\d{4}-\d{2}-\d{2}T/.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v);
                if (isoDate) {
                  const d = new Date(v);
                  if (!isNaN(d)) {
                    const dd = ('0' + d.getDate()).slice(-2);
                    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
                    const yyyy = d.getFullYear();
                    display = `${dd}/${mm}/${yyyy}`;
                  } else display = v;
                } else {
                  display = v;
                }
              }
            } else if (typeof v === 'object') {
              display = JSON.stringify(v);
            } else {
              display = String(v);
            }

            // If this is a phone column, render as tel: link so clicking opens dialer
            if(/soDienThoai/i.test(c) && display){
              const a = document.createElement('a');
              // sanitize phone number (keep digits and plus)
              const raw = String(item[c] || display);
              const cleaned = raw.replace(/[^0-9+]/g, '');
              a.href = 'tel:' + cleaned;
              a.textContent = display;
              a.className = 'phone-link';
              td.appendChild(a);
            } else {
              td.textContent = display;
            }
            td.style.padding = '10px';
            td.style.borderBottom = '1px solid #f1f5f9';
            tr.appendChild(td);
          });

          const tdActions = document.createElement('td');
          tdActions.style.whiteSpace = 'nowrap';
          tdActions.style.padding = '10px';

          // specialized edit buttons
          if(key === 'taiKhoan'){
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'Sửa'; btnEdit.className = 'link-btn'; btnEdit.style.marginRight = '8px';
            btnEdit.addEventListener('click', ()=> openTaiModal('edit', item));
            tdActions.appendChild(btnEdit);
          } else if(key === 'maKhoa'){
            const btnEditK = document.createElement('button'); btnEditK.textContent='Sửa'; btnEditK.className='link-btn'; btnEditK.style.marginRight='8px'; btnEditK.addEventListener('click', ()=> openMaModal('edit', item)); tdActions.appendChild(btnEditK);
          } else if(key === 'nganhHoc'){
            const btnEditN = document.createElement('button'); btnEditN.textContent='Sửa'; btnEditN.className='link-btn'; btnEditN.style.marginRight='8px'; btnEditN.addEventListener('click', ()=> openNgModal('edit', item)); tdActions.appendChild(btnEditN);
          } else if(key === 'lopHoc'){
            const btnEditL = document.createElement('button'); btnEditL.textContent='Sửa'; btnEditL.className='link-btn'; btnEditL.style.marginRight='8px'; btnEditL.addEventListener('click', ()=> openLopModal('edit', item)); tdActions.appendChild(btnEditL);
          } else if(key === 'monHoc'){
            const btnEditM = document.createElement('button'); btnEditM.textContent='Sửa'; btnEditM.className='link-btn'; btnEditM.style.marginRight='8px'; btnEditM.addEventListener('click', ()=> openMonModal('edit', item)); tdActions.appendChild(btnEditM);
          } else {
            // generic edit for other modules
            const btnEditG = document.createElement('button'); btnEditG.textContent='Sửa'; btnEditG.className='link-btn'; btnEditG.style.marginRight='8px';
            btnEditG.addEventListener('click', ()=> openGenericModal('edit', key, item));
            tdActions.appendChild(btnEditG);
          }

          const btnDel = document.createElement('button');
          btnDel.textContent = 'Xóa';
          btnDel.className = 'link-btn';
          btnDel.addEventListener('click', ()=>{
            if(!confirm('Xác nhận xóa?')) return;
            fetch(api + '/' + id, { method: 'DELETE', credentials: 'include' })
              .then(r=>{
                if(r.ok) loadListFor(key, containerId);
              });
          });
          tdActions.appendChild(btnDel);
          tr.appendChild(tdActions);
          tbody.appendChild(tr);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        el.innerHTML = '';
        el.appendChild(table);
      }).catch(()=>{});
  }

  // hook create buttons
  // Modal helpers for TaiKhoan create/edit
  const taiModal = document.getElementById('taiKhoanModal');
  const taiForm = document.getElementById('taiForm');
  let taiEditingId = null;

  function openTaiModal(mode, data){
    taiEditingId = null;
    document.getElementById('modalTitle').textContent = mode === 'edit' ? 'Sửa tài khoản' : 'Tạo tài khoản';
    // populate fields
    const form = taiForm;
    ['TenDangNhap','MatKhau','HoTen','Email','SoDienThoai','VaiTro','TrangThai','NgaySinh','GioiTinh','MaLop','ChuyenNganh','HocVi'].forEach(name=>{
      const el = form.elements[name];
      if(!el) return;
      el.value = '';
    });

    // load LopHoc options
    fetch(routes.lopHoc, { credentials:'include' }).then(r=> r.ok ? r.json() : []).then(list=>{
      const sel = taiForm.elements['MaLop'];
      if(!sel) return;
      sel.innerHTML = '<option value="">-- Chọn lớp --</option>';
      list.forEach(x=>{
        const opt = document.createElement('option');
        // controller returns tenLop and maLop maybe
        opt.value = x.maLop || x.maLop;
        opt.textContent = x.tenLop || x.TenLop || ('Lop ' + (x.maLop || ''));
        sel.appendChild(opt);
      });
      if(mode === 'edit' && data){
        // fill values from data
        taiEditingId = getId(data);
        form.elements['TenDangNhap'].value = data.tenDangNhap || data.TenDangNhap || '';
        // Do NOT populate password field when editing — leave empty to keep existing password
        form.elements['MatKhau'].value = '';
        form.elements['HoTen'].value = data.hoTen || data.HoTen || '';
        form.elements['Email'].value = data.email || data.Email || '';
        form.elements['SoDienThoai'].value = data.soDienThoai || data.SoDienThoai || '';
        form.elements['VaiTro'].value = data.vaiTro || data.VaiTro || '';
        form.elements['TrangThai'].value = (data.trangThai === false) ? 'false' : 'true';
        if(data.ngaySinh) form.elements['NgaySinh'].value = (new Date(data.ngaySinh)).toISOString().slice(0,10);
        if(typeof data.gioiTinh !== 'undefined') form.elements['GioiTinh'].value = data.gioiTinh === true ? 'true' : 'false';
        if(data.maLop) form.elements['MaLop'].value = data.maLop;
        form.elements['ChuyenNganh'].value = data.chuyenNganh || data.ChuyenNganh || '';
        form.elements['HocVi'].value = data.hocVi || data.HocVi || '';
      }
    }).catch(()=>{});

    taiModal.classList.remove('hidden');
  }

  // close modal
  document.getElementById('cancelTai').addEventListener('click', ()=>{ taiModal.classList.add('hidden'); });

  // handle submit
  taiForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const f = ev.target;
    const payload = {
      TenDangNhap: f.elements['TenDangNhap'].value,
      MatKhau: f.elements['MatKhau'].value,
      HoTen: f.elements['HoTen'].value,
      Email: f.elements['Email'].value,
      SoDienThoai: f.elements['SoDienThoai'].value,
      VaiTro: f.elements['VaiTro'].value,
      TrangThai: f.elements['TrangThai'].value === 'true',
      NgaySinh: f.elements['NgaySinh'].value || null,
      GioiTinh: f.elements['GioiTinh'].value === '' ? null : (f.elements['GioiTinh'].value === 'true'),
      MaLop: f.elements['MaLop'].value ? parseInt(f.elements['MaLop'].value) : null,
      ChuyenNganh: f.elements['ChuyenNganh'].value,
      HocVi: f.elements['HocVi'].value
    };

    // validate password length only when provided (create or when user set new password)
    if(payload.MatKhau && payload.MatKhau.length > 0 && payload.MatKhau.length < 8){
      return alert('Mật khẩu phải có ít nhất 8 ký tự.');
    }

    const method = taiEditingId ? 'PUT' : 'POST';
    const url = taiEditingId ? (routes.taiKhoan + '/' + taiEditingId) : routes.taiKhoan;
    fetch(url, { method: method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), credentials: 'include' })
      .then(r=>{
        if(r.ok){
          taiModal.classList.add('hidden');
          loadListFor('taiKhoan','taiKhoanList');
        } else {
          r.text().then(t=> alert('Lỗi: ' + t));
        }
      }).catch(err=> alert('Lỗi: ' + err));
  });

  const createTaiBtn = document.getElementById('createTaiKhoan');
  if(createTaiBtn) createTaiBtn.addEventListener('click', ()=> openTaiModal('create'));

  // MaKhoa modal handling
  const maModal = document.getElementById('maKhoaModal');
  const maForm = document.getElementById('maForm');
  let maEditingId = null;

  function openMaModal(mode, data){
    maEditingId = null;
    document.getElementById('maModalTitle').textContent = mode === 'edit' ? 'Sửa khoa' : 'Tạo khoa';
    const f = maForm;
    f.elements['TenKhoa'].value = '';
    f.elements['MoTa'].value = '';
    if(mode === 'edit' && data){
      maEditingId = getId(data);
      f.elements['TenKhoa'].value = data.tenKhoa || data.TenKhoa || '';
      f.elements['MoTa'].value = data.moTa || data.MoTa || '';
    }
    maModal.classList.remove('hidden');
  }

  document.getElementById('cancelMa').addEventListener('click', ()=> maModal.classList.add('hidden'));

  maForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const f = ev.target;
    const payload = { TenKhoa: f.elements['TenKhoa'].value, MoTa: f.elements['MoTa'].value };
    const method = maEditingId ? 'PUT' : 'POST';
    const url = maEditingId ? (routes.maKhoa + '/' + maEditingId) : routes.maKhoa;
    fetch(url, { method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), credentials:'include' })
      .then(r=>{ if(r.ok){ maModal.classList.add('hidden'); loadListFor('maKhoa','maKhoaList'); } else r.text().then(t=>alert('Lỗi: '+t)); });
  });

  const createKhoaBtn = document.getElementById('createMaKhoa');
  if(createKhoaBtn) createKhoaBtn.addEventListener('click', ()=> openMaModal('create'));

  // NganhHoc modal handling
  const ngModal = document.getElementById('nganhHocModal');
  const ngForm = document.getElementById('ngForm');
  let ngEditingId = null;

  function openNgModal(mode, data){
    ngEditingId = null;
    document.getElementById('ngModalTitle').textContent = mode === 'edit' ? 'Sửa ngành học' : 'Tạo ngành học';
    const f = ngForm;
    f.elements['TenNganh'].value = '';
    f.elements['MaKhoa'].innerHTML = '<option value="">-- Chọn khoa --</option>';
    f.elements['MoTa'].value = '';

    // load khoa options
    fetch(routes.maKhoa, { credentials:'include' }).then(r=> r.ok ? r.json() : []).then(list=>{
      list.forEach(x=>{
        const opt = document.createElement('option');
        opt.value = x.maKhoa || x.Khoa || x.khoa;
        opt.textContent = x.tenKhoa || x.TenKhoa || x.Ten || ('Khoa ' + opt.value);
        f.elements['MaKhoa'].appendChild(opt);
      });
      if(mode === 'edit' && data){
        ngEditingId = getId(data);
        f.elements['TenNganh'].value = data.tenNganh || data.TenNganh || '';
        f.elements['MaKhoa'].value = data.maKhoa || data.MaKhoa || '';
        f.elements['MoTa'].value = data.moTa || data.MoTa || '';
      }
    }).catch(()=>{});

    ngModal.classList.remove('hidden');
  }

  document.getElementById('cancelNg').addEventListener('click', ()=> ngModal.classList.add('hidden'));

  ngForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const f = ev.target;
    const payload = { TenNganh: f.elements['TenNganh'].value, MaKhoa: f.elements['MaKhoa'].value || null, MoTa: f.elements['MoTa'].value };
    const method = ngEditingId ? 'PUT' : 'POST';
    const url = ngEditingId ? (routes.nganhHoc + '/' + ngEditingId) : routes.nganhHoc;
    fetch(url, { method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), credentials:'include' })
      .then(r=>{ if(r.ok){ ngModal.classList.add('hidden'); loadListFor('nganhHoc','nganhHocList'); } else r.text().then(t=>alert('Lỗi: '+t)); });
  });

  const createNganhBtn = document.getElementById('createNganhHoc');
  if(createNganhBtn) createNganhBtn.addEventListener('click', ()=> openNgModal('create'));

  // LopHoc modal handling
  const lopModal = document.getElementById('lopHocModal');
  const lopForm = document.getElementById('lopForm');
  let lopEditingId = null;

  function openLopModal(mode, data){
    lopEditingId = null;
    document.getElementById('lopModalTitle').textContent = mode === 'edit' ? 'Sửa lớp học' : 'Tạo lớp học';
    const f = lopForm;
    f.elements['TenLop'].value = '';
    f.elements['Khoa'].value = '';
    f.elements['NienKhoa'].value = '';
    f.elements['MaNganh'].innerHTML = '<option value="">-- Chọn ngành --</option>';

    // load nganh options
    fetch(routes.nganhHoc, { credentials:'include' }).then(r=> r.ok ? r.json() : []).then(list=>{
      list.forEach(x=>{
        const opt = document.createElement('option');
        opt.value = x.maNganh || x.MaNganh || x.maNganh;
        opt.textContent = x.tenNganh || x.TenNganh || ('Ngành ' + opt.value);
        f.elements['MaNganh'].appendChild(opt);
      });
      if(mode === 'edit' && data){
        lopEditingId = getId(data);
        f.elements['TenLop'].value = data.tenLop || data.TenLop || '';
        f.elements['Khoa'].value = data.khoa || data.Khoa || '';
        f.elements['NienKhoa'].value = data.nienKhoa || data.NienKhoa || '';
        f.elements['MaNganh'].value = data.maNganh || data.MaNganh || '';
      }
    }).catch(()=>{});

    lopModal.classList.remove('hidden');
  }

  document.getElementById('cancelLop').addEventListener('click', ()=> lopModal.classList.add('hidden'));

  lopForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const f = ev.target;
    const payload = {
      TenLop: f.elements['TenLop'].value,
      Khoa: f.elements['Khoa'].value,
      NienKhoa: f.elements['NienKhoa'].value,
      MaNganh: f.elements['MaNganh'].value ? parseInt(f.elements['MaNganh'].value) : null
    };
    const method = lopEditingId ? 'PUT' : 'POST';
    const url = lopEditingId ? (routes.lopHoc + '/' + lopEditingId) : routes.lopHoc;
    fetch(url, { method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), credentials:'include' })
      .then(r=>{ if(r.ok){ lopModal.classList.add('hidden'); loadListFor('lopHoc','lopHocList'); } else r.text().then(t=>alert('Lỗi: '+t)); })
      .catch(e=> alert('Lỗi: '+e));
  });

  const createLopBtn = document.getElementById('createLopHoc');
  if(createLopBtn) createLopBtn.addEventListener('click', ()=> openLopModal('create'));

  // MonHoc modal handling
  const monModal = document.getElementById('monHocModal');
  const monForm = document.getElementById('monForm');
  let monEditingId = null;

  function openMonModal(mode, data){
    monEditingId = null;
    document.getElementById('monModalTitle').textContent = mode === 'edit' ? 'Sửa môn học' : 'Tạo môn học';
    const f = monForm;
    f.elements['TenMonHoc'].value = '';
    f.elements['SoTinChi'].value = '';
    f.elements['MoTa'].value = '';
    if(mode === 'edit' && data){
      monEditingId = getId(data);
      f.elements['TenMonHoc'].value = data.tenMonHoc || data.TenMonHoc || '';
      f.elements['SoTinChi'].value = (typeof data.soTinChi !== 'undefined') ? data.soTinChi : (data.SoTinChi || '');
      f.elements['MoTa'].value = data.moTa || data.MoTa || '';
    }
    monModal.classList.remove('hidden');
  }

  document.getElementById('cancelMon').addEventListener('click', ()=> monModal.classList.add('hidden'));

  monForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const f = ev.target;
    const payload = {
      TenMonHoc: f.elements['TenMonHoc'].value,
      SoTinChi: parseInt(f.elements['SoTinChi'].value) || 0,
      MoTa: f.elements['MoTa'].value
    };
    const method = monEditingId ? 'PUT' : 'POST';
    const url = monEditingId ? (routes.monHoc + '/' + monEditingId) : routes.monHoc;
    fetch(url, { method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), credentials:'include' })
      .then(r=>{ if(r.ok){ monModal.classList.add('hidden'); loadListFor('monHoc','monHocList'); } else r.text().then(t=>alert('Lỗi: '+t)); })
      .catch(e=> alert('Lỗi: '+e));
  });

  const createMonBtn = document.getElementById('createMonHoc');
  if(createMonBtn) createMonBtn.addEventListener('click', ()=> openMonModal('create'));

  // Generic modal handling for modules without specific forms
  const genericModal = document.getElementById('genericModal');
  const genericForm = document.getElementById('genericForm');
  let genericKey = null;
  let genericEditingId = null;

  function openGenericModal(mode, key, data){
    genericKey = key;
    genericEditingId = null;
    document.getElementById('genericModalTitle').textContent = mode === 'edit' ? ('Sửa ' + key) : ('Tạo ' + key);
    const ta = genericForm.elements['json'];
    const container = document.getElementById('genericFields');
    container.innerHTML = '';
    ta.style.display = 'none';

    async function buildFieldsFrom(obj){
      container.innerHTML = '';
      const lookupMap = {
        maMonHoc: { api: routes.monHoc, valueKey: 'maMonHoc', label: (x)=> x.tenMonHoc || x.TenMonHoc || x.ten || x.maMonHoc },
        maGiangVien: { api: routes.taiKhoan, valueKey: 'maTaiKhoan', label: (x)=> (x.hoTen || x.HoTen || x.TenDangNhap)+' ('+(x.vaiTro||x.VaiTro||'')+')' },
        maHocKy: { api: routes.hocKy, valueKey: 'maHocKy', label: (x)=> (x.tenHocKy || x.TenHocKy) + ' ' + (x.namHoc || x.NamHoc || '') },
        maLop: { api: routes.lopHoc, valueKey: 'maLop', label: (x)=> x.tenLop || x.TenLop || x.tenLop || x.maLop },
        maLopHocPhan: { api: routes.lopHocPhan, valueKey: 'maLopHocPhan', label: (x)=> x.tenLopHocPhan || x.TenLopHocPhan || ('LHP '+(x.maLopHocPhan||'')) },
        maSinhVien: { api: routes.taiKhoan, valueKey: 'maTaiKhoan', label: (x)=> x.hoTen || x.HoTen || x.TenDangNhap },
        maTaiKhoan: { api: routes.taiKhoan, valueKey: 'maTaiKhoan', label: (x)=> x.hoTen || x.HoTen || x.TenDangNhap }
      };

      for(const k of Object.keys(obj)){
        const v = obj[k];
        if(typeof v === 'object' && v !== null) continue; // skip complex
        const row = document.createElement('div'); row.className = 'form-row';
        const lbl = document.createElement('label'); lbl.textContent = k; lbl.style.width='140px'; lbl.style.fontWeight='600'; lbl.style.color='#334155';

        // detect if this key should be a lookup select
        const lk = lookupMap[k] || lookupMap[k.charAt(0).toLowerCase() + k.slice(1)];
        if(lk){
          const sel = document.createElement('select');
          sel.name = k;
          sel.style.flex='1'; sel.style.padding='8px'; sel.style.border='1px solid #e6eef7'; sel.style.borderRadius='8px';
          const opt = document.createElement('option'); opt.value = ''; opt.textContent = '-- Chọn --'; sel.appendChild(opt);
          row.appendChild(lbl); row.appendChild(sel);
          container.appendChild(row);
          // fetch options
          try{
            const res = await fetch(lk.api, { credentials:'include' });
            if(res.ok){
              const list = await res.json();
              list.forEach(x=>{
                const o = document.createElement('option');
                o.value = x[lk.valueKey] || x[lk.valueKey.toLowerCase()] || x[Object.keys(x)[0]];
                o.textContent = lk.label(x);
                sel.appendChild(o);
              });
              // set value if provided
              if(mode === 'edit' && typeof v !== 'undefined' && v !== null){ sel.value = v; }
            } else {
              // fallback to text input
              const input = document.createElement('input'); input.type='text'; input.name=k; input.value = v || '';
              input.style.flex='1'; input.style.padding='8px'; input.style.border='1px solid #e6eef7'; input.style.borderRadius='8px';
              row.removeChild(sel); row.appendChild(input);
            }
          }catch(e){
            const input = document.createElement('input'); input.type='text'; input.name=k; input.value = v || '';
            input.style.flex='1'; input.style.padding='8px'; input.style.border='1px solid #e6eef7'; input.style.borderRadius='8px';
            row.removeChild(sel); row.appendChild(input);
          }
        } else {
          // normal input types
          let input;
          if(typeof v === 'boolean'){
            input = document.createElement('select');
            const o1 = document.createElement('option'); o1.value='true'; o1.textContent='true';
            const o2 = document.createElement('option'); o2.value='false'; o2.textContent='false';
            input.appendChild(o1); input.appendChild(o2);
            input.value = v ? 'true' : 'false';
          } else if(typeof v === 'number'){
            input = document.createElement('input'); input.type = 'number'; input.value = v;
          } else {
            const isDateKey = /ngay|date|nam|thoigian|time/i.test(k);
            const isIsoDate = typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v);
            if(isDateKey || isIsoDate){ input = document.createElement('input'); input.type='date'; if(v) input.value = isIsoDate ? (new Date(v)).toISOString().slice(0,10) : v; }
            else { input = document.createElement('input'); input.type='text'; input.value = v==null?'':v; }
          }
          input.name = k;
          input.style.flex='1'; input.style.padding='8px'; input.style.border='1px solid #e6eef7'; input.style.borderRadius='8px';
          row.appendChild(lbl); row.appendChild(input);
          container.appendChild(row);
        }
      }
    }

    if(mode === 'edit' && data){
      genericEditingId = getId(data);
      buildFieldsFrom(data);
    } else {
      // try to infer schema from existing items
      fetch(routes[key], { credentials:'include' }).then(r=> r.ok ? r.json() : []).then(list=>{
        if(Array.isArray(list) && list.length>0){ buildFieldsFrom(list[0]); }
        else { ta.style.display = 'block'; ta.value = '{}'; }
      }).catch(()=>{ ta.style.display = 'block'; ta.value = '{}'; });
    }
    genericModal.classList.remove('hidden');
  }

  document.getElementById('cancelGeneric').addEventListener('click', ()=> { genericModal.classList.add('hidden'); document.getElementById('genericFields').innerHTML=''; genericForm.elements['json'].value=''; });
  genericForm.addEventListener('submit', function(ev){
    ev.preventDefault();
    const container = document.getElementById('genericFields');
    let payload = null;
    if(container && container.children.length>0){
      payload = {};
      Array.from(container.querySelectorAll('.form-row')).forEach(row=>{
        const input = row.querySelector('input,select,textarea');
        if(!input || !input.name) return;
        let val = input.value;
        if(input.type==='number') val = val===''?null:parseFloat(val);
        if(input.tagName.toLowerCase()==='select' && (val==='true' || val==='false')) val = (val==='true');
        payload[input.name] = val;
      });
    } else {
      const raw = genericForm.elements['json'].value || '{}';
      try{ payload = JSON.parse(raw); }catch(e){ return alert('JSON không hợp lệ: ' + e); }
    }

    const api = routes[genericKey];
    if(!api) return alert('Không có API cho ' + genericKey);
    const method = genericEditingId ? 'PUT' : 'POST';
    const url = genericEditingId ? (api + '/' + genericEditingId) : api;
    fetch(url, { method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload), credentials:'include' })
      .then(r=>{ if(r.ok){ genericModal.classList.add('hidden'); document.getElementById('genericFields').innerHTML=''; genericForm.elements['json'].value=''; loadListFor(genericKey, genericKey + 'List'); } else r.text().then(t=>alert('Lỗi: '+t)); })
      .catch(e=> alert('Lỗi: '+e));
  });

  // hook create buttons for modules without specific forms
  const createLopHocPhanBtn = document.getElementById('createLopHocPhan'); if(createLopHocPhanBtn) createLopHocPhanBtn.addEventListener('click', ()=> openGenericModal('create','lopHocPhan', null));
  const createDangKyBtn = document.getElementById('createDangKyHoc'); if(createDangKyBtn) createDangKyBtn.addEventListener('click', ()=> openGenericModal('create','dangKyHoc', null));
  const createKetQuaBtn = document.getElementById('createKetQuaHocTap'); if(createKetQuaBtn) createKetQuaBtn.addEventListener('click', ()=> openGenericModal('create','ketQuaHocTap', null));
  const createPhanCongBtn = document.getElementById('createPhanCongGiangDay'); if(createPhanCongBtn) createPhanCongBtn.addEventListener('click', ()=> openGenericModal('create','phanCongGiangDay', null));

  // initial load
  loadListFor('taiKhoan', 'taiKhoanList');
  loadListFor('maKhoa', 'maKhoaList');
  loadListFor('nganhHoc', 'nganhHocList');
  loadListFor('lopHoc', 'lopHocList');
  loadListFor('monHoc', 'monHocList');
  loadListFor('hocKy', 'hocKyList');
  loadListFor('lopHocPhan', 'lopHocPhanList');
  loadListFor('dangKyHoc', 'dangKyHocList');
  loadListFor('ketQuaHocTap', 'ketQuaHocTapList');
  loadListFor('phanCongGiangDay', 'phanCongGiangDayList');

})();
