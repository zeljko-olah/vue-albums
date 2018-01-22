export function capitalize (name) {
  if (!name) {
    return
  }
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function allowNameLength (name, allowedLength = 20) {
  let allowedName = name.split('').slice(0, allowedLength).join('')
  return allowedName.length >= allowedLength ? allowedName + '...' : allowedName
}
