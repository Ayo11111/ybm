/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-12 10:38:50
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-12 10:39:22
 */
export function creatAudio(type, url) {
  const audioDom = document.createElement('audio')
  audioDom.src = url
  document.getElementsByTagName('body')[0].append(audioDom)
  if (type === 'creat') {
    playAudio(audioDom, url)
  }
  return audioDom
}

const endTime = 2

const error = (url, dom) =>
  setTimeout(() => {
    if (dom) document.getElementsByTagName('body')[0].removeChild(dom)
    creatAudio('creat', url)
  }, 1000 * 1.5)

export async function playAudio(audio, url) {
  let COUNT = 0
  if (audio) {
    try {
      await audio.play()
      audio.onended = () => {
        const { audio } = window
        audio.play()
        ++COUNT
        if (COUNT >= endTime) {
          audio.onended = null
        }
      }
    } catch (e) {
      error(audio.src, audio)
    }
  } else {
    error(url)
  }
}
