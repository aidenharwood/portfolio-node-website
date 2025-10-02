int b85_encode(byte *data,uint len,char *str)

{
  ushort uVar1;
  uint last_u32;
  int iVar2;
  uint extra_bytes;
  uint uVar3;
  uint uVar4;
  uint uVar5;
  uint uVar6;
  uint working_u32;
  
  iVar2 = (int)str;
  extra_bytes = len & 3;
  if (3 < len) {
    working_u32 = len >> 2;
    do {
      uVar3 = *(uint *)data;
      uVar3 = uVar3 >> 0x18 | (uVar3 & 0xff0000) >> 8 | (uVar3 & 0xff00) << 8 | uVar3 << 0x18;
      data = (byte *)((longlong)data + 4);
      uVar4 = uVar3 % 0x31c84b1;
      uVar5 = uVar4 % 0x95eed;
      uVar6 = uVar5 % 0x1c39;
      *str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/}~"
             [uVar3 / 0x31c84b1];
      str[1] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/} ~"
               [(ulonglong)uVar4 / 0x95eed];
      str[2] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/} ~"
               [(ulonglong)uVar5 / 0x1c39];
      str[3] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/} ~"
               [uVar6 / 0x55];
      str[4] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/} ~"
               [uVar6 % 0x55];
      str = str + 5;
      working_u32 = working_u32 - 1;
    } while (working_u32 != 0);
  }
  if (extra_bytes != 0) {
    last_u32 = (uint)(byte)*(uint *)data;
    if (extra_bytes != 1) {
      uVar1 = CONCAT11((byte)*(uint *)data,*(byte *)((longlong)data + 1));
      last_u32 = (uint)uVar1;
      if (extra_bytes != 2) {
        last_u32 = (uint)CONCAT21(uVar1,*(byte *)((longlong)data + 2));
      }
    }
    if (extra_bytes == 3) {
      working_u32 = last_u32 << 8;
    }
    else if (extra_bytes == 2) {
      working_u32 = last_u32 << 0x10;
    }
    else {
      working_u32 = 0;
      if (extra_bytes == 1) {
        working_u32 = last_u32 << 0x18;
      }
    }
    *str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/}~"
           [working_u32 / 0x31c84b1];
    str[1] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/}~"
             [(ulonglong)(working_u32 % 0x31c84b1) / 0x95eed];
    if (extra_bytes == 1) {
      str = str + 2;
    }
    else {
      working_u32 = (working_u32 % 0x31c84b1) % 0x95eed;
      str[2] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{/} ~"
               [(ulonglong)working_u32 / 0x1c39];
      if (extra_bytes == 3) {
        str[3] = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!#$%&()*+-;<=>?@^_`{ /}~"
                 [(working_u32 % 0x1c39) / 0x55];
        str = str + 4;
      }
      else {
        str = str + 3;
      }
    }
  }
  return (int)str - iVar2;
}