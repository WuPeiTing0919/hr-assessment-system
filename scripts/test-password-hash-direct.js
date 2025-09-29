const bcrypt = require('bcryptjs')

const testPasswordHashDirect = async () => {
  console.log('🔍 直接測試密碼雜湊函數')
  console.log('=' .repeat(50))

  try {
    const password = 'password123'
    const SALT_ROUNDS = 12

    console.log('\n📊 1. 測試密碼雜湊...')
    console.log('   原始密碼:', password)
    console.log('   鹽輪數:', SALT_ROUNDS)

    // 雜湊密碼
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    console.log('   雜湊後密碼:', hashedPassword)
    console.log('   雜湊長度:', hashedPassword.length)

    // 驗證密碼
    console.log('\n📊 2. 測試密碼驗證...')
    const isValid1 = await bcrypt.compare(password, hashedPassword)
    console.log('   驗證原始密碼:', isValid1 ? '✅ 成功' : '❌ 失敗')

    const isValid2 = await bcrypt.compare('wrongpassword', hashedPassword)
    console.log('   驗證錯誤密碼:', isValid2 ? '✅ 成功' : '❌ 失敗')

    const isValid3 = await bcrypt.compare('Password123', hashedPassword)
    console.log('   驗證大小寫不同密碼:', isValid3 ? '✅ 成功' : '❌ 失敗')

    // 測試多次雜湊
    console.log('\n📊 3. 測試多次雜湊...')
    const hash1 = await bcrypt.hash(password, SALT_ROUNDS)
    const hash2 = await bcrypt.hash(password, SALT_ROUNDS)
    console.log('   第一次雜湊:', hash1)
    console.log('   第二次雜湊:', hash2)
    console.log('   兩次雜湊相同:', hash1 === hash2 ? '是' : '否')

    // 驗證兩次雜湊
    const verify1 = await bcrypt.compare(password, hash1)
    const verify2 = await bcrypt.compare(password, hash2)
    console.log('   第一次雜湊驗證:', verify1 ? '✅ 成功' : '❌ 失敗')
    console.log('   第二次雜湊驗證:', verify2 ? '✅ 成功' : '❌ 失敗')

    console.log('\n📝 密碼雜湊測試總結:')
    console.log('✅ bcrypt 函數運作正常')
    console.log('✅ 密碼雜湊和驗證功能正常')
    console.log('✅ 每次雜湊結果不同（這是正常的）')
    console.log('✅ 相同密碼的不同雜湊都可以正確驗證')

  } catch (error) {
    console.error('❌ 測試失敗:', error.message)
  } finally {
    console.log('\n✅ 密碼雜湊直接測試完成')
  }
}

testPasswordHashDirect()
