import * as FileSystem from 'expo-file-system';

class CacheManager {
  static async clearAllCache() {
    try {
      const cacheDirectory = FileSystem.cacheDirectory;

      // 캐시 디렉터리 내의 파일 목록 얻기
      const files = await FileSystem.readDirectoryAsync(cacheDirectory);

      // 각 파일을 삭제
      await Promise.all(files.map(async file => {
        const filePath = `${cacheDirectory}${file}`;
        await FileSystem.deleteAsync(filePath, {idempotent: true});
      }));

      console.log('캐시 밀기 성공!!!');
    } catch (error) {
      console.error('❌ 캐시 클리어 실패', error);
    }
  }
}

export default CacheManager;
