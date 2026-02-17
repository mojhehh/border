# Code Citations

## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```


## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```


## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```


## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```


## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```


## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```


## License: MIT
https://github.com/zcong1993/blog-lagency/blob/7ee7e3e3bdeda69cbbc20843936a89efae69e7a8/src/pages/articles/2017-04-14-firebase/index.md

```
Can't read rules via REST. The rules need to be set in the Firebase Console. Based on what we observed:

- **Read rooms**: works without auth ✅ (needed for joining)
- **Write/delete rooms**: works without auth ❌ **EXPLOIT** — anyone can nuke all rooms

You need to go to the [Firebase Console](https://console.firebase.google.com/project/border-f1340/database/border-f1340-default-rtdb/rules) and set rules like this:

```json
{
  "rules": {
    "rooms": {
      ".read": true,
      "$roomId": {
        ".write": "auth != null",
        "players": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

This would:
- Allow anyone
```

