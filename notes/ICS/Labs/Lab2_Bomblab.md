# BombLab

*PKU，2025Fall，ICS，BombLab*

> ⚠️ 致各位同学：
> 
> **本笔记的目的是借鉴交流，而非仅仅提供答案，请勿抄袭，后果自负。**
> 
> 你可以参考我的想法、了解有哪些注意的地方，但是在自己实现的时候不要参考，避免抄袭。

```asm
000000000001aec <phase_6>:
    1aec:	f3 0f 1e fa          	endbr64
    1af0:	41 54                	push   %r12
    1af2:	55                   	push   %rbp
    1af3:	53                   	push   %rbx
    1af4:	48 83 ec 60          	sub    $0x60,%rsp
    1af8:	64 48 8b 04 25 28 00 	mov    %fs:0x28,%rax
    1aff:	00 00 
    1b01:	48 89 44 24 58       	mov    %rax,0x58(%rsp)
    1b06:	31 c0                	xor    %eax,%eax
    1b08:	48 89 e6             	mov    %rsp,%rsi
    1b0b:	e8 ae 06 00 00       	call   21be <read_six_numbers>
    1b10:	bd 00 00 00 00       	mov    $0x0,%ebp
    1b15:	eb 27                	jmp    1b3e <phase_6+0x52>
    1b17:	e8 1c 06 00 00       	call   2138 <explode_bomb>
    1b1c:	eb 33                	jmp    1b51 <phase_6+0x65>
    1b1e:	83 c3 01             	add    $0x1,%ebx
    1b21:	83 fb 05             	cmp    $0n'hx5,%ebx
    1b24:	7f 15                	jg     1b3b <phase_6+0x4f>
    1b26:	48 63 c5             	movslq %ebp,%rax
    1b29:	48 63 d3             	movslq %ebx,%rdx
    1b2c:	8b 3c 94             	mov    (%rsp,%rdx,4),%edi
    1b2f:	39 3c 84             	cmp    %edi,(%rsp,%rax,4)
    1b32:	75 ea                	jne    1b1e <phase_6+0x32>
    1b34:	e8 ff 05 00 00       	call   2138 <explode_bomb>
    1b39:	eb e3                	jmp    1b1e <phase_6+0x32>
    1b3b:	44 89 e5             	mov    %r12d,%ebp
    1b3e:	83 fd 05             	cmp    $0x5,%ebp
    1b41:	7f 17                	jg     1b5a <phase_6+0x6e>
    1b43:	48 63 c5             	movslq %ebp,%rax
    1b46:	8b 04 84             	mov    (%rsp,%rax,4),%eax
    1b49:	83 e8 01             	sub    $0x1,%eax
    1b4c:	83 f8 05             	cmp    $0x5,%eax
    1b4f:	77 c6                	ja     1b17 <phase_6+0x2b>
    1b51:	44 8d 65 01          	lea    0x1(%rbp),%r12d
    1b55:	44 89 e3             	mov    %r12d,%ebx
    1b58:	eb c7                	jmp    1b21 <phase_6+0x35>
    1b5a:	b8 00 00 00 00       	mov    $0x0,%eax
    1b5f:	eb 11                	jmp    1b72 <phase_6+0x86>
    1b61:	48 63 c8             	movslq %eax,%rcx
    1b64:	ba 07 00 00 00       	mov    $0x7,%edx
    1b69:	2b 14 8c             	sub    (%rsp,%rcx,4),%edx
    1b6c:	89 14 8c             	mov    %edx,(%rsp,%rcx,4)
    1b6f:	83 c0 01             	add    $0x1,%eax
    1b72:	83 f8 05             	cmp    $0x5,%eax
    1b75:	7e ea                	jle    1b61 <phase_6+0x75>
    1b77:	be 00 00 00 00       	mov    $0x0,%esi
    1b7c:	eb 17                	jmp    1b95 <phase_6+0xa9>
    1b7e:	48 8b 52 08          	mov    0x8(%rdx),%rdx
    1b82:	83 c0 01             	add    $0x1,%eax
    1b85:	48 63 ce             	movslq %esi,%rcx
    1b88:	39 04 8c             	cmp    %eax,(%rsp,%rcx,4)
    1b8b:	7f f1                	jg     1b7e <phase_6+0x92>
    1b8d:	48 89 54 cc 20       	mov    %rdx,0x20(%rsp,%rcx,8)
    1b92:	83 c6 01             	add    $0x1,%esi
    1b95:	83 fe 05             	cmp    $0x5,%esi
    1b98:	7f 0e                	jg     1ba8 <phase_6+0xbc>
    1b9a:	b8 01 00 00 00       	mov    $0x1,%eax
    1b9f:	48 8d 15 aa 64 00 00 	lea    0x64aa(%rip),%rdx        # 8050 <node1>
    1ba6:	eb dd                	jmp    1b85 <phase_6+0x99>
    1ba8:	48 8b 5c 24 20       	mov    0x20(%rsp),%rbx
    1bad:	48 89 d9             	mov    %rbx,%rcx
    1bb0:	b8 01 00 00 00       	mov    $0x1,%eax
    1bb5:	eb 12                	jmp    1bc9 <phase_6+0xdd>
    1bb7:	48 63 d0             	movslq %eax,%rdx
    1bba:	48 8b 54 d4 20       	mov    0x20(%rsp,%rdx,8),%rdx
    1bbf:	48 89 51 08          	mov    %rdx,0x8(%rcx)
    1bc3:	83 c0 01             	add    $0x1,%eax
    1bc6:	48 89 d1             	mov    %rdx,%rcx
    1bc9:	83 f8 05             	cmp    $0x5,%eax
    1bcc:	7e e9                	jle    1bb7 <phase_6+0xcb>
    1bce:	48 c7 41 08 00 00 00 	movq   $0x0,0x8(%rcx)
    1bd5:	00 
    1bd6:	bd 00 00 00 00       	mov    $0x0,%ebp
    1bdb:	eb 07                	jmp    1be4 <phase_6+0xf8>
    1bdd:	48 8b 5b 08          	mov    0x8(%rbx),%rbx
    1be1:	83 c5 01             	add    $0x1,%ebp
    1be4:	83 fd 04             	cmp    $0x4,%ebp
    1be7:	7f 11                	jg     1bfa <phase_6+0x10e>
    1be9:	48 8b 43 08          	mov    0x8(%rbx),%rax
    1bed:	8b 00                	mov    (%rax),%eax
    1bef:	39 03                	cmp    %eax,(%rbx)
    1bf1:	7d ea                	jge    1bdd <phase_6+0xf1>
    1bf3:	e8 40 05 00 00       	call   2138 <explode_bomb>
    1bf8:	eb e3                	jmp    1bdd <phase_6+0xf1>
    1bfa:	48 8b 44 24 58       	mov    0x58(%rsp),%rax
    1bff:	64 48 2b 04 25 28 00 	sub    %fs:0x28,%rax
    1c06:	00 00 
    1c08:	75 09                	jne    1c13 <phase_6+0x127>
    1c0a:	48 83 c4 60          	add    $0x60,%rsp
    1c0e:	5b                   	pop    %rbx
    1c0f:	5d                   	pop    %rbp
    1c10:	41 5c                	pop    %r12
    1c12:	c3                   	ret
    1c13:	e8 88 f6 ff ff       	call   12a0 <__stack_chk_fail@plt>

```
