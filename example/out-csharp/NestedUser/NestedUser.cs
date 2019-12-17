// <auto-generated>
//     Generated by the protocol buffer compiler.  DO NOT EDIT!
//     source: nested-user.proto
// </auto-generated>
#pragma warning disable 1591, 0612, 3021
#region Designer generated code

using pb = global::Google.Protobuf;
using pbc = global::Google.Protobuf.Collections;
using pbr = global::Google.Protobuf.Reflection;
using scg = global::System.Collections.Generic;
namespace NestedUser {

  /// <summary>Holder for reflection information generated from nested-user.proto</summary>
  public static partial class NestedUserReflection {

    #region Descriptor
    /// <summary>File descriptor for nested-user.proto</summary>
    public static pbr::FileDescriptor Descriptor {
      get { return descriptor; }
    }
    private static pbr::FileDescriptor descriptor;

    static NestedUserReflection() {
      byte[] descriptorData = global::System.Convert.FromBase64String(
          string.Concat(
            "ChFuZXN0ZWQtdXNlci5wcm90bxILbmVzdGVkX3VzZXIaDG5lc3RlZC5wcm90",
            "byJaCgpOZXN0ZWRVc2VyEh8KAm5vGAEgASgLMhMubmVzdGVkLk5lc3RlZE91",
            "dGVyEisKAm5pGAIgASgLMh8ubmVzdGVkLk5lc3RlZE91dGVyLk5lc3RlZElu",
            "bmVyYgZwcm90bzM="));
      descriptor = pbr::FileDescriptor.FromGeneratedCode(descriptorData,
          new pbr::FileDescriptor[] { global::Nested.NestedReflection.Descriptor, },
          new pbr::GeneratedClrTypeInfo(null, null, new pbr::GeneratedClrTypeInfo[] {
            new pbr::GeneratedClrTypeInfo(typeof(global::NestedUser.NestedUser), global::NestedUser.NestedUser.Parser, new[]{ "No", "Ni" }, null, null, null, null)
          }));
    }
    #endregion

  }
  #region Messages
  public sealed partial class NestedUser : pb::IMessage<NestedUser> {
    private static readonly pb::MessageParser<NestedUser> _parser = new pb::MessageParser<NestedUser>(() => new NestedUser());
    private pb::UnknownFieldSet _unknownFields;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pb::MessageParser<NestedUser> Parser { get { return _parser; } }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public static pbr::MessageDescriptor Descriptor {
      get { return global::NestedUser.NestedUserReflection.Descriptor.MessageTypes[0]; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    pbr::MessageDescriptor pb::IMessage.Descriptor {
      get { return Descriptor; }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public NestedUser() {
      OnConstruction();
    }

    partial void OnConstruction();

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public NestedUser(NestedUser other) : this() {
      no_ = other.no_ != null ? other.no_.Clone() : null;
      ni_ = other.ni_ != null ? other.ni_.Clone() : null;
      _unknownFields = pb::UnknownFieldSet.Clone(other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public NestedUser Clone() {
      return new NestedUser(this);
    }

    /// <summary>Field number for the "no" field.</summary>
    public const int NoFieldNumber = 1;
    private global::Nested.NestedOuter no_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Nested.NestedOuter No {
      get { return no_; }
      set {
        no_ = value;
      }
    }

    /// <summary>Field number for the "ni" field.</summary>
    public const int NiFieldNumber = 2;
    private global::Nested.NestedOuter.Types.NestedInner ni_;
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public global::Nested.NestedOuter.Types.NestedInner Ni {
      get { return ni_; }
      set {
        ni_ = value;
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override bool Equals(object other) {
      return Equals(other as NestedUser);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public bool Equals(NestedUser other) {
      if (ReferenceEquals(other, null)) {
        return false;
      }
      if (ReferenceEquals(other, this)) {
        return true;
      }
      if (!object.Equals(No, other.No)) return false;
      if (!object.Equals(Ni, other.Ni)) return false;
      return Equals(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override int GetHashCode() {
      int hash = 1;
      if (no_ != null) hash ^= No.GetHashCode();
      if (ni_ != null) hash ^= Ni.GetHashCode();
      if (_unknownFields != null) {
        hash ^= _unknownFields.GetHashCode();
      }
      return hash;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public override string ToString() {
      return pb::JsonFormatter.ToDiagnosticString(this);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void WriteTo(pb::CodedOutputStream output) {
      if (no_ != null) {
        output.WriteRawTag(10);
        output.WriteMessage(No);
      }
      if (ni_ != null) {
        output.WriteRawTag(18);
        output.WriteMessage(Ni);
      }
      if (_unknownFields != null) {
        _unknownFields.WriteTo(output);
      }
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public int CalculateSize() {
      int size = 0;
      if (no_ != null) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(No);
      }
      if (ni_ != null) {
        size += 1 + pb::CodedOutputStream.ComputeMessageSize(Ni);
      }
      if (_unknownFields != null) {
        size += _unknownFields.CalculateSize();
      }
      return size;
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(NestedUser other) {
      if (other == null) {
        return;
      }
      if (other.no_ != null) {
        if (no_ == null) {
          No = new global::Nested.NestedOuter();
        }
        No.MergeFrom(other.No);
      }
      if (other.ni_ != null) {
        if (ni_ == null) {
          Ni = new global::Nested.NestedOuter.Types.NestedInner();
        }
        Ni.MergeFrom(other.Ni);
      }
      _unknownFields = pb::UnknownFieldSet.MergeFrom(_unknownFields, other._unknownFields);
    }

    [global::System.Diagnostics.DebuggerNonUserCodeAttribute]
    public void MergeFrom(pb::CodedInputStream input) {
      uint tag;
      while ((tag = input.ReadTag()) != 0) {
        switch(tag) {
          default:
            _unknownFields = pb::UnknownFieldSet.MergeFieldFrom(_unknownFields, input);
            break;
          case 10: {
            if (no_ == null) {
              No = new global::Nested.NestedOuter();
            }
            input.ReadMessage(No);
            break;
          }
          case 18: {
            if (ni_ == null) {
              Ni = new global::Nested.NestedOuter.Types.NestedInner();
            }
            input.ReadMessage(Ni);
            break;
          }
        }
      }
    }

  }

  #endregion

}

#endregion Designer generated code